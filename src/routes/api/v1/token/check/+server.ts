import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"

export const POST = async({request}) => {

    const data = await request.formData().catch(() => {
        throw error(400, `invalid format, needs to be multipart/form-data`)
    })

    const token = data.get('token')

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