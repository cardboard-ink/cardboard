import type { Handle } from '@sveltejs/kit'
import { db } from '$lib/server/database'
import { cleanupAuths } from '$lib/server/authclean'

/*
	You can use a custom redirect if you want...

	function redirect(location: string) {
		return new Response(undefined, {
			status: 303,
			headers: { location },
		})
	}

	...and redirect pages inside hooks.server.ts

	if (!session) {
		if (event.url.pathname === '/admin') {
			return redirect('/')
		}

		return await resolve(event)
	}

	...but doing it inside `load` for the protected
	routes you can invalidate the data on the page
*/

export const handle: Handle = async ({ event, resolve }) => {
	// get cookies from browser
	// const session = event.cookies.get('session')

	cleanupAuths()
	const session = event.cookies.get('guildedAuthSession')

	if (!session) {
		// if there is no session load page as normal
		return await resolve(event)
	}

	// find the user based on the session
	const user = await db.guildedAuthSession.findUnique({
		where: { id: session },
		select: { expiresAt: true, user: {select: {id: true, username: true, avatar: true, banner: true}}},
	})

	if (!user) {
		// if the session doesn't exist delete the cookie
		event.cookies.set('session', '', {
			path: '/',
			expires: new Date(0),
		})
		return await resolve(event)
	}

	// if the session has expired
	if (user?.expiresAt < new Date()) {
		// delete the session
		await db.guildedAuthSession.delete({ where: { id: session } })
		event.cookies.set('session', '', {
			path: '/',
			expires: new Date(0),
		})
		return await resolve(event)
	}

	const sessionUser = user.user

	// if `user` exists set `events.local`
	if (user) {
		event.locals.user = {
			id: sessionUser.id,
			name: sessionUser.username,
			displayName: sessionUser.username,
			avatar: sessionUser.avatar,
			banner: sessionUser.banner,
		}
	}
	// load page as normal
	return await resolve(event)
}
