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
        const baseUrl = (process.env.TB_BASE_URL || 'https://chastity-video-proactive.ngrok-free.dev').replace(/\/+$/, '');
        const adminUser = process.env.TB_USERNAME || process.env.TB_ADMIN_USER;
        const adminPass = process.env.TB_PASSWORD || process.env.TB_ADMIN_PASS;
        const adminApiKey = process.env.TB_ADMIN_API_KEY || process.env.TB_API_KEY;

        // 1. Obtener el token de sesión de Clerk desde la cabecera Authorization
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Falta cabecera Authorization con el token de Clerk.' });
        }

        const sessionToken = authHeader.substring(7);
        let clerkUserId = null;
        let targetUserId = null;

        try {
            const parts = sessionToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                clerkUserId = payload.sub;

                // Intentar leer private_metadata directamente de las claims del JWT
                const jwtPMeta = payload.private_metadata || payload.privateMetadata || {};
                targetUserId = jwtPMeta.tbUserId || jwtPMeta.tb_user_id || jwtPMeta.tb_id || jwtPMeta.tbId || jwtPMeta.tokenId || jwtPMeta.userId || jwtPMeta.id || null;
            }
        } catch (e) {
            console.warn('Error decodificando token de Clerk:', e);
        }

        // 2. Si no estaba en la claim del JWT, consultar la API REST de Clerk usando CLERK_SECRET_KEY
        const clerkSecretKey = process.env.CLERK_SECRET_KEY;
        if (clerkUserId && clerkSecretKey && !targetUserId) {
            const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
                headers: {
                    'Authorization': `Bearer ${clerkSecretKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (clerkRes.ok) {
                const clerkUser = await clerkRes.json();
                const pMeta = clerkUser.private_metadata || {};
                targetUserId = pMeta.tbUserId || pMeta.tb_user_id || pMeta.tb_id || pMeta.tbId || pMeta.tokenId || pMeta.userId || pMeta.id || null;
            }
        }

        if (!targetUserId) {
            return res.status(400).json({ 
                error: 'No se encontró un ID de ThingsBoard (tbUserId) en los metadatos privados (private_metadata) del usuario en Clerk.' 
            });
        }

        // 3. Obtener el token JWT del usuario desde ThingsBoard usando Impersonation
        // Si hay una API Key de Admin configurada:
        if (adminApiKey) {
            const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `ApiKey ${adminApiKey}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (impersonateRes.ok) {
                const tokenData = await impersonateRes.json();
                if (tokenData && tokenData.token) {
                    return res.status(200).json({ token: tokenData.token });
                }
            }
        }

        // Si hay usuario y contraseña de Admin configurados en Vercel:
        if (adminUser && adminPass) {
            const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ username: adminUser, password: adminPass })
            });

            if (loginRes.ok) {
                const adminData = await loginRes.json();
                if (adminData && adminData.token) {
                    const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
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
                    }
                }
            }
        }

        return res.status(500).json({ 
            error: `No se pudo obtener el token JWT de ThingsBoard para el User ID '${targetUserId}' obtenido de Clerk.` 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}