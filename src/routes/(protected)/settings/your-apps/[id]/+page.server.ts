import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit"
import { z } from "zod";
import { setError, superValidate } from "sveltekit-superforms/server";

const schema = z.object({
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    banner: z.string(),
    redirectUri: z.string().url(),
    supportServer: z.string().url(),
    vanityCode: z.string().optional(),
});

export const load = async ({locals, params}) => {
    if (!locals.user) {
          throw redirect(302, '/')
      }
    const appId = params.id;
    const app = await db.app.findUnique({
        where: {
            id: appId,
        }
    })
    if (!app) {
        throw redirect(302, '/settings/your-apps')
    }
    if (app.ownerId !== locals.user.id) {
        throw redirect(302, '/settings/your-apps')
    }

    const form = await superValidate(app, schema)
    return {app, form}
  }

export const actions = {
    deleteApp: async ({locals, params}) => {
        const appId = params.id;
        const app = await db.app.findUnique({
            where: {
                id: appId,
            }
        })
        if (!app) {
            throw redirect(302, '/settings/your-apps')
        }
        if (app.ownerId !== locals.user.id) {
            throw redirect(302, '/settings/your-apps')
        }

        await db.authorizedAppSession.deleteMany({
            where: {
                userAppManager: {
                    appId
                }
            }
        })

        await db.app.delete({
            where: {
                id: appId,
            }
        })

        throw redirect(302, '/settings/your-apps')
    },
    updateApp: async ({request, locals, params}) => {
        const appId = params.id;
        const app = await db.app.findUnique({
            where: {
                id: appId,
            }
        })
        if (!app) {
            throw redirect(302, '/settings/your-apps')
        }
        if (app.ownerId !== locals.user.id) {
            throw redirect(302, '/settings/your-apps')
        }
        let form = await superValidate(request, schema)
        if (!form.valid) {
            return fail(400, { form })
        }

        if (form.data.vanityCode) {
            const existingVanityCodeApp = await db.app.findUnique({
                where: {
                    vanityCode: form.data.vanityCode,
                }
            })
            if (existingVanityCodeApp) {
                if (existingVanityCodeApp.id !== appId) {
                    return setError(form, 'vanityCode', 'This vanity code is already in use.')
                }
            }
        }
        const updatedApp = await db.app.update({
            where: {
                id: appId,
            },
            data: {
                name: form.data.name,
                description: form.data.description,
                icon: form.data.icon.length === 0 ? undefined : form.data.icon,
                banner: form.data.banner.length === 0 ? undefined : form.data.banner,
                redirectUri: form.data.redirectUri,
                supportServer: form.data.supportServer,
                vanityCode: form.data.vanityCode ? form.data.vanityCode : undefined,
            }
        })
        form = await superValidate(updatedApp, schema)
        return {app: updatedApp, form}
    }
}