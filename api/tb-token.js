export default async function handler(req, res) {
    try {
        if (!process.env.TB_BASE_URL || !process.env.TB_USERNAME || !process.env.TB_PASSWORD) {
            return res.status(500).json({ 
                error: 'Faltan configurar las variables de entorno en Vercel (TB_BASE_URL, TB_USERNAME, TB_PASSWORD).' 
            });
        }

        const tbResponse = await fetch(`${process.env.TB_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: process.env.TB_USERNAME,
                password: process.env.TB_PASSWORD
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