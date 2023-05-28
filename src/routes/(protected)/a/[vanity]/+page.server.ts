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
            authorizedSessions: {
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

        const checkExisting = await db.authorizedApp.findFirst({
            where: {
                userId: user.id,
                appId: appExists.id,
            },
            select: {
                id: true,
            }
        })

        if (checkExisting) {
            //delete old
            await db.authorizedApp.deleteMany({
                where: {
                    id: checkExisting.id,
                }
            })
        }

        const authorizedApp = await db.authorizedApp.create({
            data: {
                app: {
                    connect: {
                        id: appExists.id,
                    }
                },
                user: {
                    connect: {
                        id: user.id,
                    }
                },
                expiresAt: new Date(Date.now() + 1000 * 60 * 1),
            }
        })
        throw redirect(302, `${appExists.redirectUri}?code=${authorizedApp.authToken}`)
    }
}