import { redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/database';

export const PATCH = async ({ locals, params }) => {
	if (!locals.user) {
		redirect(302, '/login');
	}

	const appId = params.id;
	const newSecret = randomUUID();
	const hashedSecret = await bcrypt.hash(newSecret, 10);

	const app = await db.app.findUnique({
		where: {
			id: appId
		}
	});
	if (!app) {
		redirect(302, '/settings/your-apps');
	}
	if (app.ownerId !== locals.user.id) {
		redirect(302, '/settings/your-apps');
	}

	await db.app.update({
		where: {
			id: appId
		},
		data: {
			secret: hashedSecret
		}
	});

	return new Response(JSON.stringify({ secret: newSecret }));
};
