import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import { randomUUID } from "crypto"
import bcrypt from 'bcrypt'

export const POST = async ({request}) => {

    const contentType = request.headers.get('content-type')
    console.log(contentType)
    let clientId: string | undefined | null 
    let clientSecret: string | undefined | null 
    let grantType: string | undefined | null 
    let authToken: string | undefined | null 
    let state: string | undefined | null 
    let refreshToken: string | undefined | null 
    
    if (contentType === 'application/x-www-form-urlencoded') {
        const data = await request.formData().catch(() => {
            throw error(400, `invalid format, needs to be multipart/form-data`)
        })
        clientId = data.get('client_id') as string
        clientSecret = data.get('client_secret') as string
        grantType = data.get('grant_type') as string
        authToken = data.get('code') as string
        state = data.get('state') as string
        refreshToken = data.get('refresh_token') as string
    } else if (contentType === 'application/json') {
        const data = await request.json().catch(() => {
            throw error(400, `invalid format, needs to be application/json`)
        })
        clientId = data.client_id
        clientSecret = data.client_secret
        grantType = data.grant_type
        authToken = data.code
        state = data.state
        refreshToken = data.refresh_token
    } else {
        throw error(400, `invalid format, needs to be multipart/form-data or application/json`)
    }

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

    if (grantType === 'authorization_code') {
        if (!authToken || typeof authToken !== 'string') {
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
            throw error(400, 'invalid client')
        }
        if(!app.secret) {
            throw error(400, 'invalid client')
        }
        const comparision = await bcrypt.compare(clientSecret, app.secret)
        if (!comparision) {
            throw error(400, 'invalid client')
        }
        const pre = await db.authorizedAppSession.findUnique({
            where: {
                authToken,
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
            throw error(400, 'invalid code, has it expired?')
        }
        if (!(pre.userAppManager.app.id === app.id)) {
            throw error(400, 'invalid code, has it expired?')
        }
        const auth = await db.authorizedAppSession.update({
            where: {
                id: pre.id,
            },
            data: {
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
        const data = {
            access_token: auth.authToken,
            expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
            refresh_token: auth.refreshToken,
            token_type: 'Bearer',
            state
        }
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    } else if (grantType === 'refresh_token') {
        if (!refreshToken || typeof refreshToken !== 'string') {
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
            throw error(400, 'invalid client')
        }
        if(!app.secret) {
            throw error(400, 'invalid client')
        }
        const comparision = await bcrypt.compare(clientSecret, app.secret)
        if (!comparision) {
            throw error(400, 'invalid client')
        }
        const pre = await db.authorizedAppSession.findUnique({
            where: {
                refreshToken,
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
            throw error(400, 'invalid code, has it expired?')
        }
        const accessibleApp = pre.userAppManager.app.id === app.id
        if (!accessibleApp) {
            throw error(400, 'invalid code, has it expired?')
        }
        const auth = await db.authorizedAppSession.update({
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
        const data = {
            access_token: auth.authToken,
            expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
            refresh_token: auth.refreshToken,
            token_type: 'Bearer',
            state
        }
        return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
    }
    throw error(400, 'unsupported grant_type')
}