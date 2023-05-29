import { db } from "$lib/server/database";
import { error, redirect } from "@sveltejs/kit"

export const load = async ({ locals, params }) => {
	// redirect user if logged in
	if (!locals.user) {
		throw redirect(302, '/')
	}
    const vanity = params.vanity;
    const app = await db.app.findUnique({
        where: {
            vanityCode: vanity,
        },
        select: {
            id: true,
            createdAt: true,
            ownerUser: true,
            name: true,
            description: true,
            icon: true,
            banner: true,
            redirectUri: true,
            supportServer: true,
            vanityCode: true,
            sessionManagers: {
                select: {
                    id: true
                }
            }
        }
    })
    if (!app) {
        throw error(404, 'App not found')
    }
    return {app}
}

export const actions = {
    authorizeApp: async ({locals, params}) => {
        if (!locals.user) {
            throw redirect(302, '/')
        }

        const appExists = await db.app.findUnique({
            where: {
                vanityCode: params.vanity,
            },
            select: {
                id: true,
                redirectUri: true
            }
        })
        console.log(appExists)
        if (!appExists) {
            throw error(404, 'App not found')
        }

        const user = await db.guildedUser.findUnique({
            where: {
                id: locals.user.id,
            },
        })

        if (!user) {
            throw error(404, 'User not found')
        }

        let manager = await db.userAppManager.findFirst({
            where: {
                userId: user.id,
                appId: appExists.id,
            },
            select: {
                id: true,
            }
        })
        if (!manager) {
            manager = await db.userAppManager.create({
                data: {
                    userId: user.id,
                    appId: appExists.id,
                }
            })
        }
        const newSession = await db.authorizedAppSession.create({
            data: {
                userAppManagerId: manager.id,
                expiresAt: new Date(Date.now() + 1000 * 60),
            }
        })
        throw redirect(302, `${appExists.redirectUri}?code=${newSession.authToken}`)
    }
}