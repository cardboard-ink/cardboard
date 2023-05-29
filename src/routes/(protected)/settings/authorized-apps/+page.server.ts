import { db } from "$lib/server/database"
import { redirect } from "@sveltejs/kit"

export const load = async ({ locals }) => {
	// redirect user if logged in
	if (!locals.user) {
		throw redirect(302, '/')
	}

    const appManagers = await db.userAppManager.findMany({
        where: {
            userId: locals.user.id as string,
        },
        select: {
            app: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    icon: true,
                    createdAt: true,
                    ownerUser: true,
                    banner: true,
                }
            },
            authorizedSessions: true,
        }
    })

    const userApps = await db.guildedUser.findUnique({
        where: {
            id: locals.user.id as string,
        },
        select: {
            myAuthApps: {
                select: {
                    appId: true,
                }
            }
        }
    })

    if (!userApps) {
        throw redirect(302, '/')
    }

    const userAppsUnwrapped = userApps.myAuthApps.map((app) => app.appId)

    const getAppManagerFromAppId = async (appId: string) => {
        const managers = await db.userAppManager.findMany({
            where: {
                appId
            },
            select: {
                id: true,
            }
        })
        // IDK WTF IS HAPPENING HERE, IF I DONT CONSOLE LOG THIS SHIT DOES NOT WORK
        // TODO: CLEAN THIS 
        console.log(managers)
        return managers
    }

    const getAppUserCount: (appIds: string[]) => Promise<Record<string, number>> | Record<string, number> = (appIds) => {
        const appUserCount: Record<string, number> = {}
        appIds.forEach(async (appId) => {
            const managers = await getAppManagerFromAppId(appId)
            appUserCount[appId] = managers.length
        })
        return appUserCount
    }

    const appUserCount = await getAppUserCount(userAppsUnwrapped)

    return {appManagers, appUserCount}
}
