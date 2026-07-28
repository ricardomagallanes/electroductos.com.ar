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
        // API Key por defecto (Ricardo Magallanes)
        let apiKey = process.env.TB_API_KEY || 'tb_Q1KhKWF81TWsMbnFjNk61a2TMhE7oAMnCH6fEIikgKia_Of6lKyn2CZL4dr7oZlz_VW58xKEeBZ37KeOuMyEaQ';

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

                            const foundKey = pMeta.tbApiKey || pMeta.apiKey || pubMeta.tbApiKey || pubMeta.apiKey || unsMeta.tbApiKey || unsMeta.apiKey;
                            if (foundKey) {
                                apiKey = foundKey;
                            }
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk:', clerkErr);
            }
        }

        // ÚNICA LÓGICA DE AUTENTICACIÓN: Validar API Key contra ThingsBoard /api/auth/user
        const userCheckRes = await fetch(`${baseUrl}/api/auth/user`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `ApiKey ${apiKey}`
            }
        });

        if (!userCheckRes.ok) {
            const errData = await userCheckRes.text().catch(() => '');
            return res.status(401).json({ 
                error: 'El API Key de ThingsBoard fue rechazado', 
                details: errData 
            });
        }

        const userData = await userCheckRes.json();

        // Devolver única y exclusivamente el API Key autenticado
        return res.status(200).json({ 
            token: apiKey, 
            user: userData.email || userData.name 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}