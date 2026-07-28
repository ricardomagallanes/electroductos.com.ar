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
        const baseUrl = process.env.TB_BASE_URL || 'https://thingsboard.cloud';
        const adminApiKey = process.env.TB_ADMIN_API_KEY || process.env.TB_API_KEY;
        
        let targetUserId = 'f48c29f0-8a96-11f1-a40e-2ba7ae4918b3'; // ID por defecto de Ricardo Magallanes
        let userApiKey = null;
        let username = process.env.TB_USERNAME;
        let password = process.env.TB_PASSWORD;

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
                            userApiKey = pMeta.tbApiKey || pMeta.apiKey || pubMeta.tbApiKey || unsMeta.tbApiKey;
                            if (pMeta.tbUsername && pMeta.tbPassword) {
                                username = pMeta.tbUsername;
                                password = pMeta.tbPassword;
                            }
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk:', clerkErr);
            }
        }

        // Método 1: Obtener el token JWT del usuario objetivo mediante Impersonation usando Admin API Key
        const apiKeyToUse = adminApiKey || userApiKey;
        if (targetUserId && apiKeyToUse) {
            const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `ApiKey ${apiKeyToUse}`
                }
            });

            if (impersonateRes.ok) {
                const tokenData = await impersonateRes.json();
                if (tokenData.token) {
                    return res.status(200).json({ token: tokenData.token });
                }
            }
        }

        // Método 2: Login tradicional por Usuario y Contraseña para obtener Token JWT
        if (username && password) {
            const tbResponse = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (tbResponse.ok) {
                const data = await tbResponse.json();
                return res.status(200).json({ token: data.token });
            }
        }

        return res.status(401).json({ 
            error: 'No se pudo obtener un token JWT de ThingsBoard. Asegúrate de configurar TB_ADMIN_API_KEY en Vercel (API Key del Administrador del Tenant).' 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}