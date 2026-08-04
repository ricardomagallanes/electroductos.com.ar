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
        const baseUrl = (process.env.TB_BASE_URL || 'http://www.tecnomag.com.ar:8081').replace(/\/+$/, '');
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
        let userEmail = null;
        let targetUserId = null;

        try {
            const parts = sessionToken.split('.');
            if (parts.length === 3) {
                const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                clerkUserId = payload.sub;
                userEmail = payload.email || payload.primary_email || (payload.email_addresses && payload.email_addresses[0]) || null;

                // Extraer tb_user_id como clave prioritaria #1 de private_metadata
                const jwtPMeta = payload.private_metadata || payload.privateMetadata || {};
                const jwtPubMeta = payload.public_metadata || payload.publicMetadata || {};
                const jwtUnsMeta = payload.unsafe_metadata || payload.unsafeMetadata || payload.user_metadata || {};

                targetUserId = jwtPMeta.tb_user_id || jwtPMeta.tbUserId || jwtPMeta.tb_id || jwtPMeta.tbId || jwtPMeta.tokenId || jwtPMeta.userId || jwtPMeta.id ||
                               jwtPubMeta.tb_user_id || jwtPubMeta.tbUserId || jwtPubMeta.tb_id || jwtPubMeta.tbId || jwtPubMeta.tokenId || jwtPubMeta.userId || jwtPubMeta.id ||
                               jwtUnsMeta.tb_user_id || jwtUnsMeta.tbUserId || jwtUnsMeta.tb_id || jwtUnsMeta.tbId || jwtUnsMeta.tokenId || jwtUnsMeta.userId || jwtUnsMeta.id || null;
            }
        } catch (e) {
            console.warn('Error decodificando token de Clerk:', e);
        }

        // 2. Consultar la API REST de Clerk usando CLERK_SECRET_KEY para obtener la private_metadata guardada en Clerk
        const clerkSecretKey = process.env.CLERK_SECRET_KEY;
        let clerkFetchError = null;

        if (clerkUserId && clerkSecretKey && !targetUserId) {
            try {
                const clerkRes = await fetch(`https://api.clerk.com/v1/users/${clerkUserId}`, {
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

                    targetUserId = pMeta.tb_user_id || pMeta.tbUserId || pMeta.tb_id || pMeta.tbId || pMeta.tokenId || pMeta.userId || pMeta.id ||
                                   pubMeta.tb_user_id || pubMeta.tbUserId || pubMeta.tb_id || pubMeta.tbId || pubMeta.tokenId || pubMeta.userId || pubMeta.id ||
                                   unsMeta.tb_user_id || unsMeta.tbUserId || unsMeta.tb_id || unsMeta.tbId || unsMeta.tokenId || unsMeta.userId || unsMeta.id || null;

                    if (!userEmail && clerkUser.email_addresses && clerkUser.email_addresses.length > 0) {
                        userEmail = clerkUser.email_addresses[0].email_address;
                    }
                } else {
                    clerkFetchError = `Clerk API devolvió el estado HTTP ${clerkRes.status}`;
                }
            } catch (cErr) {
                clerkFetchError = cErr.message;
            }
        } else if (!clerkSecretKey && !targetUserId) {
            clerkFetchError = 'Falta la variable de entorno CLERK_SECRET_KEY en Vercel para consultar la private_metadata desde la API de Clerk.';
        }

        // 3. Autenticación con Admin en ThingsBoard
        let adminToken = null;
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
                adminToken = adminData.token;
            }
        }

        // 4. Si targetUserId no estuvo en private_metadata, buscar por email en ThingsBoard
        if (!targetUserId && userEmail && (adminToken || adminApiKey)) {
            try {
                const authHeaderVal = adminApiKey ? `ApiKey ${adminApiKey}` : `Bearer ${adminToken}`;
                const searchRes = await fetch(`${baseUrl}/api/user?email=${encodeURIComponent(userEmail)}`, {
                    headers: {
                        'X-Authorization': authHeaderVal,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (searchRes.ok) {
                    const foundUser = await searchRes.json();
                    if (foundUser && foundUser.id && foundUser.id.id) {
                        targetUserId = foundUser.id.id;
                    }
                }
            } catch (searchErr) {
                console.warn('Error al buscar usuario por email en TB:', searchErr);
            }
        }

        if (!targetUserId) {
            return res.status(400).json({ 
                error: `No se pudo obtener el tb_user_id de la private_metadata de Clerk para el usuario (${userEmail || clerkUserId || 'autenticado'}).`,
                details: clerkFetchError || 'Asegúrate de que la variable CLERK_SECRET_KEY esté configurada en Vercel y que la clave en private_metadata sea "tb_user_id".'
            });
        }

        // 5. Impersonar al usuario cliente en ThingsBoard usando el tb_user_id extraído
        const authHeaderVal = adminApiKey ? `ApiKey ${adminApiKey}` : `Bearer ${adminToken}`;
        const impersonateRes = await fetch(`${baseUrl}/api/user/${targetUserId}/token`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': authHeaderVal,
                'ngrok-skip-browser-warning': 'true'
            }
        });

        if (impersonateRes.ok) {
            const impData = await impersonateRes.json();
            if (impData && impData.token) {
                return res.status(200).json({ token: impData.token });
            }
        }

        const impErrText = await impersonateRes.text().catch(() => '');
        return res.status(403).json({ 
            error: `No se pudo obtener el token JWT de ThingsBoard para el tb_user_id '${targetUserId}' extraído de Clerk.`,
            details: impErrText 
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}