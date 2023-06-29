import { db } from '$lib/server/database';
import { handleLoginRedirect } from '$lib/server/loginredirect.js';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals, params, url }) => {
	// redirect user if logged in
	if (!locals.user) {
		throw redirect(302, handleLoginRedirect(url, 'You must login to authorize the app.'));
	}
	const vanity = params.vanity;

	let redirect_uri: string | URL | null = url.searchParams.get('redirect_uri');
	const scope = url.searchParams.get('scope');
	const state = url.searchParams.get('state');
	const response_type = url.searchParams.get('response_type');

	const app = await db.app.findUnique({
		where: {
			vanityCode: vanity
		},
		select: {
			id: true,
			createdAt: true,
			ownerUser: true,
			name: true,
			description: true,
			icon: true,
			banner: true,
			redirectUri: true,
			supportServer: true,
			vanityCode: true,
			sessionManagers: {
				select: {
					id: true
				}
			}
		}
	});
	if (!app) {
		throw error(404, 'App not found');
	}

	if (redirect_uri) {
		try {
			const app_redirect_uri = new URL(app.redirectUri);
			redirect_uri = new URL(redirect_uri);
			if (redirect_uri.origin !== app_redirect_uri.origin) {
				throw error(
					400,
					`Invalid redirect_uri, must be on the same domain as the app config redirect_uri! Contact app developer if you believe this is a mistake.`
				);
			}
			redirect_uri = redirect_uri.toString();
		} catch (e) {
			throw error(400, `Invalid redirect_uri,\n${e}`);
		}
	}

	return { app, redirect_uri, scope, state, response_type };
};

export const actions = {
	authorizeApp: async ({ locals, params, url }) => {
		if (!locals.user) {
			throw redirect(302, '/');
		}

		const redirect_uri = url.searchParams.get('redirect_uri');
		const state = url.searchParams.get('state');
		const response_type = url.searchParams.get('response_type');
		const scope = url.searchParams.get('scope');

		console.log(redirect_uri);

		const appExists = await db.app.findUnique({
			where: {
				vanityCode: params.vanity
			},
			select: {
				id: true,
				redirectUri: true
			}
		});

		if (!appExists) {
			throw error(404, 'App not found');
		}

		const user = await db.guildedUser.findUnique({
			where: {
				id: locals.user.id
			}
		});

		if (!user) {
			throw error(404, 'User not found');
		}

		let manager = await db.userAppManager.findFirst({
			where: {
				userId: user.id,
				appId: appExists.id
			},
			select: {
				id: true
			}
		});
		if (!manager) {
			manager = await db.userAppManager.create({
				data: {
					userId: user.id,
					appId: appExists.id
				}
			});
		}
		const newSession = await db.authorizedAppSession.create({
			data: {
				userAppManagerId: manager.id,
				expiresAt: new Date(Date.now() + 1000 * 60)
			}
		});
		if (!redirect_uri) {
			throw redirect(302, `${appExists.redirectUri}?code=${newSession.authToken}`);
		}
		throw redirect(302, `${redirect_uri}?code=${newSession.authToken}&state=${state}`);
	}
};
