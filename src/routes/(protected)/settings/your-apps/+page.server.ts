import { db } from "$lib/server/database";
import { redirect } from "@sveltejs/kit";

export const load = async ({locals, params}) => {
    if (!locals.user) {
          throw redirect(302, '/')
      }

    const myApps = await db.app.findMany({
        where:{
            ownerId: locals.user.id
        }
    })

    return {myApps}
  }