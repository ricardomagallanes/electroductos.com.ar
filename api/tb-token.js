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

                    if (userId && process.env.CLERK_SECRET_KEY) {
                        // Consultar private_metadata de Clerk de manera segura desde el servidor
                        const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
                                'Content-Type': 'application/json'
                            }
                        });

                        if (clerkRes.ok) {
                            const clerkUser = await clerkRes.json();
                            const privateMeta = clerkUser.private_metadata || {};
                            const userTbUser = privateMeta.tbUsername || privateMeta.tb_username;
                            const userTbPass = privateMeta.tbPassword || privateMeta.tb_password;

                            if (userTbUser && userTbPass) {
                                username = userTbUser;
                                password = userTbPass;
                            }
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk en backend:', clerkErr);
            }
        }

        const baseUrl = process.env.TB_BASE_URL || 'https://thingsboard.cloud';

        if (!username || !password) {
            return res.status(500).json({ 
                error: 'No hay credenciales de ThingsBoard disponibles ni en private_metadata de Clerk ni en variables de entorno.' 
            });
        }

        const tbResponse = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!tbResponse.ok) {
            const errData = await tbResponse.text().catch(() => '');
            return res.status(401).json({ error: 'Respuesta no autorizada de ThingsBoard', details: errData });
        }

        const data = await tbResponse.json();
        return res.status(200).json({ token: data.token });

    } catch (error) {
        return res.status(500).json({ error: 'Error de servidor backend', message: error.message });
    }
}