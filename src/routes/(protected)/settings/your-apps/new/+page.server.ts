import { db } from "$lib/server/database";
import { fail, redirect } from "@sveltejs/kit"
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from "zod";

const newAppSchema = z.object({
  name: z.string(),
  redirectUri: z.string(),
  supportServer: z.string(),
  vanityCode: z.string().optional(),
});

export const load = async ({locals}) => {
  if (!locals.user) {
		throw redirect(302, '/')
	}
  const form = await superValidate(newAppSchema)
  return {form}
}

export const actions = {
  newApp: async ({request, locals}) => {
    const form = await superValidate(request, newAppSchema)
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
        return setError(form, 'vanityCode', 'This vanity code is already in use.')
      }
    }

    const app = await db.app.create({
      data: {
        owner: locals.user.id,
        name: form.data.name,
        redirectUri: form.data.redirectUri,
        supportServer: form.data.supportServer,
        vanityCode: form.data.vanityCode ? form.data.vanityCode : undefined,
      }
    })

    throw redirect(302, `/settings/your-apps/${app.id}`)
  },
}