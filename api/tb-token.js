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
        const baseUrl = (process.env.TB_BASE_URL || 'https://thingsboard.cloud').replace(/\/+$/, '');
        
        // Credenciales predeterminadas de administrador en entorno Vercel
        const envUser = process.env.TB_USERNAME || process.env.TB_ADMIN_USER || process.env.TB_USER;
        const envPass = process.env.TB_PASSWORD || process.env.TB_ADMIN_PASS || process.env.TB_ADMIN_PASSWORD;
        const envDefaultUserId = process.env.TB_USER_ID || process.env.TB_TARGET_USER_ID || null;
        
        let clerkUserId = null;
        let userEmail = null;
        let targetUserId = null;
        let userTbUsername = null;
        let userTbPassword = null;
        let userStaticToken = null;

        // Extraer datos del usuario en Clerk si se envía el token Bearer en Authorization
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const sessionToken = authHeader.substring(7);
            
            try {
                const parts = sessionToken.split('.');
                if (parts.length === 3) {
                    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                    clerkUserId = payload.sub;
                    userEmail = payload.email || payload.primary_email || (payload.email_addresses && payload.email_addresses[0]) || null;

                    // 1. Extraer metadata directamente del payload del JWT de Clerk (si está configurada la claim)
                    const jwtPMeta = payload.private_metadata || payload.privateMetadata || {};
                    const jwtPubMeta = payload.public_metadata || payload.publicMetadata || {};
                    const jwtUnsMeta = payload.unsafe_metadata || payload.unsafeMetadata || payload.user_metadata || {};

                    targetUserId = jwtPMeta.tbUserId || jwtPMeta.tb_user_id || jwtPMeta.tb_id || jwtPubMeta.tbUserId || jwtUnsMeta.tbUserId || null;
                    userTbUsername = jwtPMeta.tbUsername || jwtPMeta.tb_username || jwtPMeta.tbUser || jwtPubMeta.tbUsername || jwtUnsMeta.tbUsername || null;
                    userTbPassword = jwtPMeta.tbPassword || jwtPMeta.tb_password || jwtPMeta.tbPass || jwtPubMeta.tbPassword || jwtUnsMeta.tbPassword || null;
                    userStaticToken = jwtPMeta.tbToken || jwtPMeta.tb_token || jwtPubMeta.tbToken || jwtUnsMeta.tbToken || null;

                    // 2. Si no se encontró en las claims del JWT, consultar la API REST de Clerk usando CLERK_SECRET_KEY
                    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
                    if (clerkUserId && clerkSecretKey && (!targetUserId || !userTbUsername)) {
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

                            targetUserId = targetUserId || pMeta.tbUserId || pMeta.tb_user_id || pMeta.tb_id || pubMeta.tbUserId || unsMeta.tbUserId || null;
                            userTbUsername = userTbUsername || pMeta.tbUsername || pMeta.tb_username || pMeta.tbUser || pubMeta.tbUsername || unsMeta.tbUsername || null;
                            userTbPassword = userTbPassword || pMeta.tbPassword || pMeta.tb_password || pMeta.tbPass || pubMeta.tbPassword || unsMeta.tbPassword || null;
                            userStaticToken = userStaticToken || pMeta.tbToken || pMeta.tb_token || pubMeta.tbToken || unsMeta.tbToken || null;

                            if (!userEmail && clerkUser.email_addresses && clerkUser.email_addresses.length > 0) {
                                userEmail = clerkUser.email_addresses[0].email_address;
                            }
                        }
                    }
                }
            } catch (clerkErr) {
                console.warn('Error al verificar sesión de Clerk:', clerkErr);
            }
        }

        // SI EL USUARIO TIENE UN TOKEN ESTÁTICO EN SU METADATA DE CLERK:
        if (userStaticToken) {
            return res.status(200).json({ token: userStaticToken });
        }

        // SI EL USUARIO TIENE USUARIO Y CONTRASEÑA ESPECÍFICOS EN SU METADATA DE CLERK:
        if (userTbUsername && userTbPassword) {
            const directLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ username: userTbUsername, password: userTbPassword })
            });

            if (directLoginRes.ok) {
                const directData = await directLoginRes.json();
                if (directData && directData.token) {
                    return res.status(200).json({ token: directData.token });
                }
            }
        }

        // AUTENTICACIÓN CON ADMIN PARA IMPERSONAR AL USUARIO ESPECÍFICO DE CLERK
        if (!envUser || !envPass) {
            return res.status(500).json({ 
                error: 'Falta configurar TB_USERNAME y TB_PASSWORD de administrador en Vercel.' 
            });
        }

        // 1. Autenticar el Administrador
        const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ username: envUser, password: envPass })
        });

        if (!adminLoginRes.ok) {
            const errData = await adminLoginRes.text().catch(() => '');
            return res.status(401).json({ 
                error: `Error al autenticar administrador con ThingsBoard`, 
                details: errData 
            });
        }

        const adminData = await adminLoginRes.json();
        if (!adminData || !adminData.token) {
            return res.status(500).json({ error: 'ThingsBoard no devolvió un token de administrador válido.' });
        }

        // 2. Determinar el User ID específico del usuario en ThingsBoard
        let resolvedUserId = targetUserId;

        // Si no está en metadata pero se tiene el email del usuario de Clerk, buscarlo en ThingsBoard
        if (!resolvedUserId && userEmail) {
            try {
                const userSearchRes = await fetch(`${baseUrl}/api/user?email=${encodeURIComponent(userEmail)}`, {
                    headers: {
                        'X-Authorization': `Bearer ${adminData.token}`,
                        'ngrok-skip-browser-warning': 'true'
                    }
                });

                if (userSearchRes.ok) {
                    const foundUser = await userSearchRes.json();
                    if (foundUser && foundUser.id && foundUser.id.id) {
                        resolvedUserId = foundUser.id.id;
                    }
                }
            } catch (searchErr) {
                console.warn('Error al buscar usuario por email en TB:', searchErr);
            }
        }

        // Si no se encontró un ID específico para este usuario de Clerk:
        const finalTargetUserId = resolvedUserId || envDefaultUserId;

        if (!finalTargetUserId) {
            return res.status(403).json({
                error: `El usuario de Clerk (${userEmail || clerkUserId || 'autenticado'}) no tiene un ID de ThingsBoard (tbUserId) asignado en sus metadatos de Clerk ni existe un usuario con ese email en ThingsBoard.`
            });
        }

        // 3. Impersonar ÚNICAMENTE al usuario especifico correspondiente
        const impersonateRes = await fetch(`${baseUrl}/api/user/${finalTargetUserId}/token`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': `Bearer ${adminData.token}`,
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
            error: `No se pudo obtener el token para el usuario de ThingsBoard (User ID: ${finalTargetUserId}).`,
            details: impErrText
        });

    } catch (error) {
        return res.status(500).json({ error: 'Error del servidor backend', message: error.message });
    }
}