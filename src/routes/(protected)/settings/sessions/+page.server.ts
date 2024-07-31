import { redirect } from '@sveltejs/kit';

import { db } from '$lib/server/database';
import type { GuildedAuthSession } from '@prisma/client';

export const load = async ({ locals, cookies }) => {
	// redirect user if logged in
	if (!locals.user) {
		redirect(302, '/');
	}

	const sessions = await db.guildedUser.findUnique({
		where: { id: locals.user.id },
		select: {
			sessions: {
				select: { id: true, createdAt: true, expiresAt: true }
			}
		}
	});

	if (!sessions) {
		redirect(302, '/');
	}

	if (!sessions.sessions) {
		redirect(302, '/');
	}

	type ActiveSession = GuildedAuthSession & { current: boolean };

	const activeSessions = sessions.sessions as ActiveSession[];

	if (!activeSessions) {
		redirect(302, '/');
	}

	activeSessions.forEach((session) => {
		session.current = session.id === cookies.get('guildedAuthSession');
	});

	return { activeSessions };
};

export const actions = {
	revoke: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('identifier') as string;

		if (id === cookies.get('guildedAuthSession')) {
			redirect(302, '/settings/sessions');
		}

		if (!id) {
			redirect(302, '/settings/sessions');
		}

		//remove from db
		await db.guildedAuthSession.delete({ where: { id } });

		// seems like a nice place to clean up expired sessions
		await db.guildedAuthSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });

		// redirect the user
		redirect(302, '/settings/sessions');
	}
};
