export default async function handler(req, res) {
    // Permitir CORS para solicitudes desde GitHub Pages o cualquier dominio
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let username = process.env.TB_USERNAME;
        let password = process.env.TB_PASSWORD;

        // Si el frontend envía credenciales de un usuario específico (ej. desde metadata de Clerk)
        if (req.body) {
            let body = req.body;
            if (typeof body === 'string') {
                try { body = JSON.parse(body); } catch(e){}
            }
            if (body.username && body.password) {
                username = body.username;
                password = body.password;
            }
        }

        const baseUrl = process.env.TB_BASE_URL || 'https://thingsboard.cloud';

        if (!username || !password) {
            return res.status(500).json({ 
                error: 'No hay credenciales de ThingsBoard disponibles ni en el usuario ni en las variables de entorno.' 
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