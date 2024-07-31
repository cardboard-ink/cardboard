import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import { randomUUID } from 'crypto';

export const POST = async ({ request }) => {
	console.log(request);
	const data = await request.formData().catch(() => {
		error(400, `invalid format, needs to be multipart/form-data`);
	});
	const grantType = data.get('grant_type');
	const authToken = data.get('code');
	const refreshToken = data.get('refresh_token');

	if (!grantType || typeof grantType !== 'string') {
		error(400, 'invalid request');
	}

	if (grantType === 'authorization_code') {
		if (!authToken || typeof authToken !== 'string') {
			error(400, 'invalid request');
		}
		const pre = await db.authorizedAppSession.findUnique({
			where: {
				authToken
			},
			select: {
				id: true,
				userAppManager: {
					select: {
						app: {
							select: {
								id: true
							}
						}
					}
				}
			}
		});
		if (!pre) {
			error(400, 'invalid code, has it expired?');
		}
		const auth = await db.authorizedAppSession.update({
			where: {
				id: pre.id
			},
			data: {
				authToken: randomUUID(),
				refreshToken: randomUUID(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
			},
			select: {
				authToken: true,
				refreshToken: true,
				expiresAt: true
			}
		});
		const data = {
			access_token: auth.authToken,
			expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
			refresh_token: auth.refreshToken,
			token_type: 'Bearer'
		};
		return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
	} else if (grantType === 'refresh_token') {
		if (!refreshToken || typeof refreshToken !== 'string') {
			error(400, 'invalid request');
		}
		const pre = await db.authorizedAppSession.findUnique({
			where: {
				refreshToken
			},
			select: {
				id: true,
				userAppManager: {
					select: {
						app: {
							select: {
								id: true
							}
						}
					}
				}
			}
		});
		if (!pre) {
			error(400, 'invalid code, has it expired?');
		}
		const auth = await db.authorizedAppSession.update({
			where: {
				id: pre.id
			},
			data: {
				refreshToken: randomUUID(),
				authToken: randomUUID(),
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
			},
			select: {
				authToken: true,
				refreshToken: true,
				expiresAt: true
			}
		});
		const data = {
			access_token: auth.authToken,
			expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
			refresh_token: auth.refreshToken,
			token_type: 'Bearer'
		};
		return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
	}
	error(400, 'unsupported grant_type');
};

// import api from "$api";
// import type { RequestHandler } from "./$types";

// export const POST = async (evt) => api.handle(evt) satisfies RequestHandler;
