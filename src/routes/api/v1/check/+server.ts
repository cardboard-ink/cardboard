import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import bcrypt from 'bcrypt'

export const POST = async ({request}) => {
    const data = await request.formData().catch(() => {
        error(400, `invalid format, needs to be multipart/form-data`);
    })
    const clientId = data.get('client_id')
    const clientSecret = data.get('client_secret')
    
    if ( 
        !clientId ||
        !clientSecret || 
        typeof clientId !== 'string' || 
        typeof clientSecret !== 'string'
        ) 
    {
        error(400, 'invalid request');
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
        error(400, 'invalid client');
    }
    if(!app.secret) {
        error(400, 'invalid client');
    }
    const comparision = await bcrypt.compare(clientSecret, app.secret)
    if (!comparision) {
        error(400, 'invalid client');
    }
    const retData = {
        name: app.name,
        vanity: app.vanityCode
    }
    return new Response(JSON.stringify(retData), {headers: {'Content-Type': 'application/json'}})
}