import { db } from '$lib/server/database.js';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	// we only use this endpoint for the api
	// and don't need to see the page
	redirect(302, '/');
};

export const actions = {
	default: async ({ cookies }) => {
		const session = cookies.get('guildedAuthSession');

		if (!session) {
			redirect(302, '/login');
		}

		//remove from db
		await db.guildedAuthSession.delete({ where: { id: session } });

		// eat the cookie
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});

		// seems like a nice place to clean up expired sessions
		await db.guildedAuthSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });

		// redirect the user
		redirect(302, '/login');
	}
};
