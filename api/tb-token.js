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
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk:', clerkErr);
            }
        }

        // Sanitizar UUID: Extraer estrictamente el formato 8-4-4-4-12 para evitar IDs duplicados/corruptos
        if (targetUserId) {
            const uuidMatch = String(targetUserId).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
            if (uuidMatch) {
                targetUserId = uuidMatch[0];
            }
        }

        // Clave de API a utilizar para la solicitud de Impersonation (Admin o del propio usuario)
        const apiKeyToUse = adminApiKey || userApiKey;

        if (!apiKeyToUse) {
            return res.status(500).json({ 
                error: 'Falta configurar TB_ADMIN_API_KEY en el panel de Vercel.' 
            });
        }

        // Solicitar el Token JWT del usuario mediante Impersonation (/api/user/{userId}/token)
        const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `ApiKey ${apiKeyToUse}`
            }
        });

        if (!impersonateRes.ok) {
            const errData = await impersonateRes.text().catch(() => '');
            return res.status(401).json({ 
                error: `Error al obtener el token del cliente (User ID: ${targetUserId})`, 
                details: errData 
            });
        }

        const tokenData = await impersonateRes.json();
        
        if (tokenData && tokenData.token) {
            return res.status(200).json({ token: tokenData.token });
        } else {
            return res.status(500).json({ error: 'ThingsBoard no devolvió un token JWT válido.' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}