import { db } from "$lib/server/database";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params, locals }) => {
  	// redirect user if logged in
	if (!locals.user) {
		throw redirect(302, '/')
	}  
  const appId = params.id;
  const appName = await db.app.findUnique({
      where: {
          id: appId,
      },
      select: {
          name: true,
          sessionManagers: {
              select: {
                  id: true,
              }
          }
      }
  })

  if (!appName) {
      throw redirect(302, '/settings/authorized-apps')
  }

  const appManager = await db.userAppManager.findFirst({
      where: {
        userId: locals.user.id,
        appId: appId,
      },
      select: {
        id: true,
      }
    })

    if (!appManager) {
      throw redirect(302, '/settings/authorized-apps')
    }

    const appSessions = await db.authorizedAppSession.findMany({
        where: {
            userAppManagerId: appManager.id,
        },
        select: {
            id: true,
            createdAt: true,
            expiresAt: true,
        }
    })
    return {appName, appSessions, appManager}
}

export const actions = {
  revoke: async ({request, locals }) => {
    const data = await request.formData();
    const authAppId = data.get('identifier') as string;

    const user = locals.user.id;

    if (!authAppId) {
      throw redirect(302, '/settings/authorized-apps')
    }

    const confAuthAppOwner = await db.authorizedAppSession.findUnique({
      where: {
        id: authAppId,
      },
      select: {
        userAppManager: {
          select: {
            userId: true,
          }
        }
      }
    }).catch(() => {
      throw redirect(302, '/settings/authorized-apps')
    })

    if (!confAuthAppOwner) {
      throw redirect(302, '/settings/authorized-apps')
    }

    if (confAuthAppOwner.userAppManager.userId !== user) {
      throw redirect(302, '/settings/authorized-apps')
    }

    await db.authorizedAppSession.delete({
      where: {
        id: authAppId,
      }
    })
  },
  revokeAuth: async ({ locals, params }) => {
    const managerId = await db.userAppManager.findFirst({
      where: {
        userId: locals.user.id,
        appId: params.id,
      },
      select:{ 
        id: true,
        authorizedSessions: true
      }
    })
    console.log(managerId)
    if (!managerId) {
      throw redirect(302, '/settings/authorized-apps')
    }
    if (managerId.authorizedSessions.length > 0) {
      await db.authorizedAppSession.deleteMany({
        where: {
          userAppManagerId: managerId.id,
        }
      })
    }
    await db.userAppManager.deleteMany({
      where: {
        id: managerId.id,
      }
    })
    throw redirect(302, '/settings/authorized-apps')
  }
}