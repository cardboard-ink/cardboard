import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import bcrypt from 'bcrypt';

export const POST = async ({request}) => {
    const data = await request.formData().catch(() => {
        throw error(400, `invalid format, needs to be multipart/form-data`)
    })
    const clientId = data.get('client_id')
    const clientSecret = data.get('client_secret')
    const token = data.get('token')

    if ( 
        !clientId ||
        !clientSecret || 
        !token || 
        typeof token !== 'string' || 
        typeof clientId !== 'string' || 
        typeof clientSecret !== 'string'
        ) 
    {
        throw error(400, 'invalid request')
    }

    const app = await db.app.findUnique({
        where: {
            id: clientId,
        },
        select: {
            id: true,
            secret: true,
        }
    })
    if (!app) {
        throw error(400, 'invalid app')
    }
    if(!app.secret) {
        throw error(400, 'invalid client')
    }
    if (!bcrypt.compare(clientSecret, app.secret)) {
        throw error(400, 'invalid client')
    }
    const pre = await db.authorizedAppSession.findUnique({
        where: {
            authToken: token,
        },
        select: {
            id: true,
            userAppManager: {
                select: {
                    app: {
                        select: {
                            id: true,
                        }
                    }
                }
            }
        }
    })
    if (!pre) {
        throw error(400, 'invalid token')
    }
    if (app.id !== pre.userAppManager.app.id) {
        throw error(400, 'invalid token')
    }
    await db.authorizedAppSession.delete({
        where: {
            id: pre.id,
        } 
    })
    return new Response(JSON.stringify({}), {headers: {'Content-Type': 'application/json'}})
}