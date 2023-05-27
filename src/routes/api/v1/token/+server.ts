import { cleanupAuths } from "$lib/server/authclean"
import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import { randomUUID } from "crypto"

export const POST = async ({request}) => {
    const data = await request.formData().catch(() => {
        throw error(400, `invalid format, needs to be multipart/form-data`)
    })
    const clientId = data.get('client_id')
    const clientSecret = data.get('client_secret')
    const grantType = data.get('grant_type')
    const code = data.get('code')
    const refreshToken = data.get('refresh_token')

    if ( 
        !clientId ||
        !clientSecret || 
        !grantType || 
        typeof grantType !== 'string' || 
        typeof clientId !== 'string' || 
        typeof clientSecret !== 'string'
        ) 
    {
        throw error(400, 'invalid request')
    }

    await cleanupAuths()

    if (grantType === 'authorization_code') {
        if (!code || typeof code !== 'string') {
            throw error(400, 'invalid request')
        }
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
            throw error(400, 'invalid client')
        }
        const pre = await db.authorizedApp.findUnique({
            where: {
                code,
            },
            select: {
                id: true,
            }
        })
        if (!pre) {
            throw error(400, 'invalid code, has it expired?')
        }
        const auth = await db.authorizedApp.update({
            where: {
                id: pre.id,
            },
            data: {
                code: null,
                authToken: randomUUID(),
                refreshToken: randomUUID(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            },
            select: {
                authToken: true,
                refreshToken: true,
                expiresAt: true,
            }
        })
        const data = new URLSearchParams(JSON.stringify({
            access_token: auth.authToken,
            expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
            refresh_token: auth.refreshToken,
            token_type: 'Bearer',
        }))
        return new Response(data)
    } else if (grantType === 'refresh_token') {
        if (!refreshToken || typeof refreshToken !== 'string') {
            throw error(400, 'invalid request')
        }
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
            throw error(400, 'invalid client')
        }
        const pre = await db.authorizedApp.findUnique({
            where: {
                refreshToken,
            },
            select: {
                id: true,
            }
        })
        if (!pre) {
            throw error(400, 'invalid code, has it expired?')
        }
        const auth = await db.authorizedApp.update({
            where: {
                id: pre.id,
            },
            data: {
                refreshToken: randomUUID(),
                authToken: randomUUID(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            },
            select: {
                authToken: true,
                refreshToken: true,
                expiresAt: true,
            }
        })
        const data = new URLSearchParams(JSON.stringify({
            access_token: auth.authToken,
            expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
            refresh_token: auth.refreshToken,
            token_type: 'Bearer',
        }))
        return new Response(data)
    }
    throw error(400, 'unsupported grant_type')
}