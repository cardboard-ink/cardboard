import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const POST = async ({ request }) => {
	const data = await request.formData().catch(() => {
		throw error(400, `invalid format, needs to be multipart/form-data`);
	});

	const token = data.get('token');
	const clientId = data.get('client_id');
	const clientSecret = data.get('client_secret');

	if (
		!token ||
		!clientId ||
		!clientSecret ||
		typeof clientId !== 'string' ||
		typeof clientSecret !== 'string' ||
		typeof token !== 'string'
	) {
		throw error(400, 'invalid request');
	}

	let validity = false;

	const pre = await db.authorizedAppSession.findUnique({
		where: {
			authToken: token
		},
		select: {
			id: true,
			userAppManagerId: true
		}
	});

	if (pre) {
		const manager = await db.userAppManager.findUnique({
			where: {
				id: pre.userAppManagerId
			},
			select: {
				appId: true
			}
		});

		const app = await db.app.findUnique({
			where: {
				id: clientId
			},
			select: {
				id: true,
				secret: true
			}
		});

		if (manager && app && app.id === manager.appId) {
			const comparision = await bcrypt.compare(clientSecret, app.secret);
			if (comparision) {
				validity = true;
			}
		}
	}

	return new Response(JSON.stringify({ validity }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
