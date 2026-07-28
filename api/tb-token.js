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
        let apiKey = process.env.TB_API_KEY || null;
        let username = process.env.TB_USERNAME || null;
        let password = process.env.TB_PASSWORD || null;

        // Extraer token de sesión de Clerk si viene en la cabecera Authorization
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const sessionToken = authHeader.substring(7);
            
            try {
                const parts = sessionToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                    const userId = payload.sub;

                    if (userId && process.env.CLERK_SECRET_KEY) {
                        const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (clerkRes.ok) {
                            const clerkUser = await clerkRes.json();
                            const privateMeta = clerkUser.private_metadata || {};
                            
                            // Prioridad 1: API Key asignada al usuario en privateMetadata
                            if (privateMeta.tbApiKey || privateMeta.apiKey) {
                                apiKey = privateMeta.tbApiKey || privateMeta.apiKey;
                            } 
                            // Prioridad 2: Usuario y Contraseña en privateMetadata
                            else if ((privateMeta.tbUsername || privateMeta.tb_username) && (privateMeta.tbPassword || privateMeta.tb_password)) {
                                username = privateMeta.tbUsername || privateMeta.tb_username;
                                password = privateMeta.tbPassword || privateMeta.tb_password;
                            }
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk en backend:', clerkErr);
            }
        }

        // Si hay un API Key disponible (del usuario en Clerk o de Vercel)
        if (apiKey) {
            // Verificar validez del API Key llamando a /api/auth/user en ThingsBoard
            const userCheckRes = await fetch(`${baseUrl}/api/auth/user`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `ApiKey ${apiKey}`
                }
            });

            if (userCheckRes.ok) {
                // Si el API Key es válido, se retorna como token de acceso directo para el iframe
                return res.status(200).json({ token: apiKey });
            } else {
                console.warn('API Key no válida o rechazada por ThingsBoard');
            }
        }

        // Si no hay API Key pero hay Usuario y Contraseña
        if (username && password) {
            const tbResponse = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!tbResponse.ok) {
                const errData = await tbResponse.text().catch(() => '');
                return res.status(401).json({ error: 'Respuesta no autorizada de ThingsBoard', details: errData });
            }

            const data = await tbResponse.json();
            return res.status(200).json({ token: data.token });
        }

        return res.status(500).json({ 
            error: 'No se encontraron credenciales válidas (tbApiKey o usuario/contraseña) en Clerk ni en Vercel.' 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error de servidor backend', message: error.message });
    }
}