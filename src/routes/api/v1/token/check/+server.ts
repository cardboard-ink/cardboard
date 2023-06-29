import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"

export const POST = async({request}) => {

    const contentType = request.headers.get('content-type')
    let token: string | undefined | null
    
    if (contentType === 'multipart/form-data') {
        const data = await request.formData().catch(() => {
            throw error(400, `invalid format, needs to be multipart/form-data`)
        })
        token = data.get('token') as string
    } else if (contentType === 'application/json') {
        const data = await request.json().catch(() => {
            throw error(400, `invalid format, needs to be application/json`)
        })
        token = data.token
    } else {
        throw error(400, `invalid format, needs to be multipart/form-data or application/json`)
    }

    if (!token || typeof token !== 'string') {
        throw error(400, 'invalid request')
    }

    let validity = false

    const pre = await db.authorizedAppSession.findUnique({
        where: {
            authToken: token,
        },
        select: {
            id: true,
        }
    })

    if (pre) {
        validity = true
    }

    return new Response(JSON.stringify({validity}), {headers: {'Content-Type': 'application/json'}})
}