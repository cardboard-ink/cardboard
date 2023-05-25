import { db } from "$lib/server/database"
import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
	// redirect user if logged in
	if (!locals.user) {
		throw redirect(302, '/')
	}

    const approvedApps = await db.authorizedApp.findMany({
        where: {
            userId: locals.user.id,
        },
        select: {
            app: {
                select: {
                    id: true,
                    createdAt: true,
                    ownerUser: true,
                    name: true,
                    description: true,
                    icon: true,
                    banner: true,
                    supportServer: true,
                    authorizedSessions: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    })
    const apps = approvedApps.map((app) => app.app)
    return {apps}
}

export const actions = {
    revokeAuth: async ({request, locals}) => {
        const data = await request.formData()
        const appId = data.get('appId')
        if (!locals.user.id) {
            throw redirect(302, '/settings/authorized-apps')
        }
        const authApp = await db.authorizedApp.findFirst({
            where: {
                userId: locals.user.id as string,
                appId: appId as string,
            },
        })
        if (!authApp) {
            throw redirect(302, '/settings/authorized-apps')
        }
        await db.authorizedApp.delete({
            where: {
                id: authApp.id,
            } 
        })
        throw redirect(302, '/settings/authorized-apps')
    }
}