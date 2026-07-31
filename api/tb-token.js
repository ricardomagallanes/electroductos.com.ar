export default async function handler(req, res) {
    // Permitir CORS para solicitudes desde cualquier origen
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const baseUrl = (process.env.TB_BASE_URL || 'https://thingsboard.cloud').replace(/\/+$/, '');
        
        // Credenciales predeterminadas de entorno
        const envUser = process.env.TB_USERNAME || process.env.TB_ADMIN_USER || process.env.TB_USER;
        const envPass = process.env.TB_PASSWORD || process.env.TB_ADMIN_PASS || process.env.TB_ADMIN_PASSWORD;
        const envTargetUserId = process.env.TB_USER_ID || process.env.TB_TARGET_USER_ID || 'f48c29f0-8a96-11f1-a40e-2ba7ae4918b3';
        
        let targetUserId = null;
        let userTbUsername = null;
        let userTbPassword = null;

        // Extraer datos del usuario en Clerk si se envía el token Bearer en Authorization
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const sessionToken = authHeader.substring(7);
            
            try {
                const parts = sessionToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                    const userId = payload.sub;

                    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
                    if (userId && clerkSecretKey) {
                        const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${clerkSecretKey}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (clerkRes.ok) {
                            const clerkUser = await clerkRes.json();
                            const pMeta = clerkUser.private_metadata || {};
                            const pubMeta = clerkUser.public_metadata || {};
                            const unsMeta = clerkUser.unsafe_metadata || {};

                            targetUserId = pMeta.tbUserId || pMeta.tb_user_id || pubMeta.tbUserId || unsMeta.tbUserId || null;
                            userTbUsername = pMeta.tbUsername || pMeta.tbUser || pubMeta.tbUsername || unsMeta.tbUsername || null;
                            userTbPassword = pMeta.tbPassword || pMeta.tbPass || pubMeta.tbPassword || unsMeta.tbPassword || null;
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk:', clerkErr);
            }
        }

        // Si no se definió un ID de usuario específico en la metadata de Clerk, usar el ID del cliente por defecto
        const finalTargetUserId = targetUserId || envTargetUserId;

        // Si el usuario en Clerk tiene su propio usuario/contraseña de TB en metadata, hacer login directo
        if (userTbUsername && userTbPassword) {
            const directLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ username: userTbUsername, password: userTbPassword })
            });

            if (directLoginRes.ok) {
                const directData = await directLoginRes.json();
                if (directData && directData.token) {
                    return res.status(200).json({ token: directData.token });
                }
            }
        }

        // De lo contrario, usar las credenciales del Administrador de entorno para autenticarse e impersonar al usuario (Customer)
        if (!envUser || !envPass) {
            return res.status(500).json({ 
                error: 'Falta configurar TB_USERNAME y TB_PASSWORD en el panel de Vercel (o en los metadatos del usuario de Clerk).' 
            });
        }

        // 1. Login del Administrador
        const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ username: envUser, password: envPass })
        });

        if (!adminLoginRes.ok) {
            const errData = await adminLoginRes.text().catch(() => '');
            return res.status(401).json({ 
                error: `Error al autenticar admin con ThingsBoard (/api/auth/login para '${envUser}')`, 
                details: errData 
            });
        }

        const adminData = await adminLoginRes.json();

        if (!adminData || !adminData.token) {
            return res.status(500).json({ error: 'ThingsBoard no devolvió un token de administrador válido.' });
        }

        // 2. Obtener el Token JWT del Cliente (Customer) mediante Impersonation (/api/user/{finalTargetUserId}/token)
        if (finalTargetUserId) {
            const impersonateRes = await fetch(`${baseUrl}/api/user/${finalTargetUserId}/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `Bearer ${adminData.token}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (impersonateRes.ok) {
                const impData = await impersonateRes.json();
                if (impData && impData.token) {
                    return res.status(200).json({ token: impData.token });
                }
            } else {
                const impErrText = await impersonateRes.text().catch(() => '');
                console.warn(`No se pudo obtener token para User ID ${finalTargetUserId}, devolviendo token de admin:`, impErrText);
            }
        }

        // Fallback: retornar token de admin si no se pudo impersonar
        return res.status(200).json({ token: adminData.token });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}