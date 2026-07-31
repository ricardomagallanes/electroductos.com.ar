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
        
        // Credenciales de entorno
        const envUser = process.env.TB_USERNAME || process.env.TB_ADMIN_USER || process.env.TB_USER;
        const envPass = process.env.TB_PASSWORD || process.env.TB_ADMIN_PASS || process.env.TB_ADMIN_PASSWORD;
        const adminApiKey = process.env.TB_ADMIN_API_KEY || process.env.TB_API_KEY;
        
        let targetUserId = 'f48c29f0-8a96-11f1-a40e-2ba7ae4918b3'; // ID por defecto
        let userTbUsername = null;
        let userTbPassword = null;
        let userApiKey = null;

        // Extraer token de sesión de Clerk si viene en la cabecera Authorization
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

                            const foundUserId = pMeta.tbUserId || pMeta.tb_user_id || pubMeta.tbUserId || unsMeta.tbUserId;
                            if (foundUserId) {
                                targetUserId = foundUserId;
                            }
                            userTbUsername = pMeta.tbUsername || pMeta.tbUser || pubMeta.tbUsername || unsMeta.tbUsername;
                            userTbPassword = pMeta.tbPassword || pMeta.tbPass || pubMeta.tbPassword || unsMeta.tbPassword;
                            userApiKey = pMeta.tbApiKey || pMeta.apiKey || pubMeta.tbApiKey || unsMeta.tbApiKey;
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk:', clerkErr);
            }
        }

        // MÉTODO 1: Autenticación por Usuario y Contraseña (/api/auth/login)
        const usernameToUse = userTbUsername || envUser;
        const passwordToUse = userTbPassword || envPass;

        if (usernameToUse && passwordToUse) {
            const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameToUse, password: passwordToUse })
            });

            if (loginRes.ok) {
                const loginData = await loginRes.json();
                if (loginData && loginData.token) {
                    // Si este usuario es un Admin y se busca impersonar a otro targetUserId distinto
                    if (targetUserId && targetUserId !== 'f48c29f0-8a96-11f1-a40e-2ba7ae4918b3') {
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
                    // Si el login fue directo para el usuario
                    return res.status(200).json({ token: loginData.token });
                }
            } else {
                const errText = await loginRes.text().catch(() => '');
                console.warn('Fallo login /api/auth/login:', errText);
            }
        }

        // MÉTODO 2: Impersonación mediante API Key (ThingsBoard Cloud PE)
        const apiKeyToUse = adminApiKey || userApiKey;
        if (apiKeyToUse) {
            const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `ApiKey ${apiKeyToUse}`
                }
            });

            if (impersonateRes.ok) {
                const tokenData = await impersonateRes.json();
                if (tokenData && tokenData.token) {
                    return res.status(200).json({ token: tokenData.token });
                }
            } else {
                const errData = await impersonateRes.text().catch(() => '');
                return res.status(401).json({ 
                    error: `Error al obtener el token mediante ApiKey (User ID: ${targetUserId})`, 
                    details: errData 
                });
            }
        }

        return res.status(500).json({ 
            error: 'Falta configurar credenciales (TB_USERNAME y TB_PASSWORD o TB_ADMIN_API_KEY) en el panel de Vercel.' 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}