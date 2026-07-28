export default async function handler(req, res) {
    try {
        const tbResponse = await fetch(`${process.env.TB_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            // Toma las credenciales seguras que pusiste en el panel de Vercel
            body: JSON.stringify({
                username: process.env.TB_USERNAME,
                password: process.env.TB_PASSWORD
            })
        });

        if (!tbResponse.ok) {
            return res.status(401).json({ error: 'Error en ThingsBoard' });
        }

        const data = await tbResponse.json();

        // Le devuelve el token a tu HTML
        return res.status(200).json({ token: data.token });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor' });
    }
}