import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import bcrypt from 'bcrypt';

export const POST = async ({request}) => {
    const contentType = request.headers.get('content-type')
    let clientId: string | undefined | null 
    let clientSecret: string | undefined | null 
    let token: string | undefined | null
    
    if (contentType === 'application/x-www-form-urlencoded') {
        const data = await request.formData().catch(() => {
            throw error(400, `invalid format, needs to be multipart/form-data`)
        })
        clientId = data.get('client_id') as string
        clientSecret = data.get('client_secret') as string
        token = data.get('token') as string
    } else if (contentType === 'application/json') {
        const data = await request.json().catch(() => {
            throw error(400, `invalid format, needs to be application/json`)
        })
        clientId = data.client_id
        clientSecret = data.client_secret
        token = data.token
    } else {
        throw error(400, `invalid format, needs to be multipart/form-data or application/json`)
    }

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