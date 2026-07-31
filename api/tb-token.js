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

        // Determinar usuario y contraseña a utilizar (Metadata del usuario en Clerk o Variables de entorno)
        const usernameToUse = userTbUsername || envUser;
        const passwordToUse = userTbPassword || envPass;

        if (!usernameToUse || !passwordToUse) {
            return res.status(500).json({ 
                error: 'Falta configurar TB_USERNAME y TB_PASSWORD en el panel de Vercel (o en los metadatos del usuario de Clerk).' 
            });
        }

        // Realizar autenticación HTTP POST en /api/auth/login de ThingsBoard
        const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameToUse, password: passwordToUse })
        });

        if (!loginRes.ok) {
            const errData = await loginRes.text().catch(() => '');
            return res.status(401).json({ 
                error: `Error al autenticar con ThingsBoard (/api/auth/login para usuario '${usernameToUse}')`, 
                details: errData 
            });
        }

        const loginData = await loginRes.json();

        if (loginData && loginData.token) {
            // Si las credenciales eran de Admin y se requiere obtener el token de otro targetUserId específico
            if (targetUserId) {
                const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Authorization': `Bearer ${loginData.token}`
                    }
                });

                if (impersonateRes.ok) {
                    const impData = await impersonateRes.json();
                    if (impData && impData.token) {
                        return res.status(200).json({ token: impData.token });
                    }
                }
            }

            // Retornar el token JWT devuelto por /api/auth/login
            return res.status(200).json({ token: loginData.token });
        } else {
            return res.status(500).json({ error: 'ThingsBoard no devolvió un token JWT válido.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}