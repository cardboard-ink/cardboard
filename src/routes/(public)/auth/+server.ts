import { db } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const client_id = url.searchParams.get('client_id');
	const redirect_uri = url.searchParams.get('redirect_uri');
	const response_type = url.searchParams.get('response_type');
	const scope = url.searchParams.get('scope');
	const state = url.searchParams.get('state');

	console.log(redirect_uri, response_type, scope, state);

	if (!client_id || typeof client_id !== 'string') {
		error(400, 'client_id is required');
	}

	const app = await db.app.findUnique({
		where: {
			id: client_id
		}
	});

	if (!app) {
		error(404, `app not found!, ${client_id}, ${app}`);
	}

	redirect(
		302,
		`/a/${app.vanityCode}?redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response_type}`
	);
};
