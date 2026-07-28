export default async function handler(req, res) {
    try {
        const { TB_BASE_URL, TB_USERNAME, TB_PASSWORD } = process.env;

        if (!TB_BASE_URL || !TB_USERNAME || !TB_PASSWORD) {
            return res.status(500).json({ 
                error: 'Faltan configurar las variables de entorno en Vercel (TB_BASE_URL, TB_USERNAME, TB_PASSWORD).' 
            });
        }

        const tbResponse = await fetch(`${TB_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                username: TB_USERNAME,
                password: TB_PASSWORD
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