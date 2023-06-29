import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import bcrypt from 'bcrypt'

export const POST = async ({request}) => {
    const contentType = request.headers.get('content-type')
    let clientId: string | undefined | null 
    let clientSecret: string | undefined | null 
    
    if (contentType === 'application/x-www-form-urlencoded;charset=utf-8') {
        const data = await request.formData().catch(() => {
            throw error(400, `invalid format, needs to be multipart/form-data`)
        })
        clientId = data.get('client_id') as string
        clientSecret = data.get('client_secret') as string
    } else if (contentType === 'application/json') {
        const data = await request.json().catch(() => {
            throw error(400, `invalid format, needs to be application/json`)
        })
        clientId = data.client_id
        clientSecret = data.client_secret
    } else {
        throw error(400, `invalid format, needs to be multipart/form-data or application/json`)
    }
    
    if ( 
        !clientId ||
        !clientSecret || 
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
            name: true,
            vanityCode: true,
        }
    })
    if (!app) {
        throw error(400, 'invalid client')
    }
    if(!app.secret) {
        throw error(400, 'invalid client')
    }
    const comparision = await bcrypt.compare(clientSecret, app.secret)
    if (!comparision) {
        throw error(400, 'invalid client')
    }
    const retData = {
        name: app.name,
        vanity: app.vanityCode
    }
    return new Response(JSON.stringify(retData), {headers: {'Content-Type': 'application/json'}})
}