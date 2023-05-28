import { cleanupAuths } from "$lib/server/authclean"
import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"

export const POST = async ({request}) => {
    const data = await request.formData()
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

    await cleanupAuths()

    const app = await db.app.findUnique({
        where: {
            id: clientId,
            secret: clientSecret,
        },
        select: {
            id: true,
        }
    })
    if (!app) {
        throw error(400, 'invalid app')
    }
    const pre = await db.authorizedApp.findUnique({
        where: {
            authToken: token,
        },
        select: {
            id: true,
            app: {select: {id: true}}
        }
    })
    if (!pre) {
        throw error(400, 'invalid token')
    }
    if (app.id !== pre.app.id) {
        throw error(400, 'invalid token')
    }
    await db.authorizedApp.delete({
        where: {
            id: pre.id,
        } 
    })
    return new Response()
}