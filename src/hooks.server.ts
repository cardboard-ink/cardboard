import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { cleanupAuths } from '$lib/server/authclean';

export const handle: Handle = async ({ event, resolve }) => {
	cleanupAuths();
	let theme = '';
	const cookieTheme = event.cookies.get('theme');
	const session = event.cookies.get('guildedAuthSession');
	if (
		cookieTheme &&
		cookieTheme != '' &&
		[
			'skeleton',
			'wintry',
			'modern',
			'rocket',
			'seafoam',
			'vintage',
			'sahara',
			'hamlindigo',
			'gold-nouveau',
			'crimson'
		].includes(cookieTheme)
	) {
		theme = cookieTheme;
	} else {
		event.cookies.set('theme', 'modern', {
			path: '/'
		});
		theme = 'modern';
	}
	if (!session) {
		// if there is no session load page as normal
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
		});
	}

	// find the user based on the session
	const user = await db.guildedAuthSession.findUnique({
		where: { id: session },
		select: {
			expiresAt: true,
			user: { select: { id: true, username: true, avatar: true, banner: true, role: true } }
		}
	});

	if (!user) {
		// if the session doesn't exist delete the cookie
		event.cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
		});
	}

	// if the session has expired
	if (user?.expiresAt < new Date()) {
		// delete the session
		await db.guildedAuthSession.delete({ where: { id: session } });
		event.cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});
		return await resolve(event, {
			transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
		});
	}

	const sessionUser = user.user;

	// if `user` exists set `events.local`
	if (user) {
		event.locals.user = {
			id: sessionUser.id,
			name: sessionUser.username,
			displayName: sessionUser.username,
			avatar: sessionUser.avatar,
			banner: sessionUser.banner,
			role: sessionUser.role
		};
	}
	// load page as normal
	return await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('data-theme=""', `data-theme="${theme}"`)
	});
};
