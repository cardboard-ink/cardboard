import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

import {z} from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { db } from '$lib/server/database'

const linkGuildedSchema = z.object({
  guildedId: z.string(),
});

export const load = async () => {
  // Server API:
  const form = await superValidate(linkGuildedSchema);

  // Always return { form } in load and form actions.
  return { form };
};

export const actions = {
	linkGuilded: async ({ cookies, request }) => {
		const data = await request.formData()
		const guildedId = data.get('guildedId')

		if (
			 !guildedId  || typeof guildedId !== 'string'
		) {
			return fail(400, { invalid: true })
		}

    // Clear old sessions 
    await db.guildedVerificationSessions.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        }
      }
    });


    const prevSession = await db.guildedVerificationSessions.findUnique({
      where: {
        userId: guildedId,
      }
    })

    if (prevSession) {
      // Delete any existing sessions
      await db.guildedVerificationSessions.deleteMany({
        where: {
          userId: guildedId,
        }
      })
    }
    await db.guildedVerificationSessions.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        userId: guildedId,
      }
    });
    // successfully redirect to userId path of login flow
    throw redirect(302, `/login/${guildedId}`);
	},
}
