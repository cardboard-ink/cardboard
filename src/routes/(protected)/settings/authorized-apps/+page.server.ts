import { db } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	// redirect user if logged in
	if (!locals.user) {
		redirect(302, '/');
	}

	const appManagers = await db.userAppManager.findMany({
		where: {
			userId: locals.user.id as string
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
					supportServer: true,
					isVerified: true
				}
			},
			authorizedSessions: true
		}
	});

	return { appManagers };
};
