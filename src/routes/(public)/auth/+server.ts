import { db } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';

export const GET = ({ url }) => {
	const client_id = url.searchParams.get('client_id');
	// const redirect_uri = url.searchParams.get('redirect_uri')
	// const response_type = url.searchParams.get('response_type')
	// const scope = url.searchParams.get('scope')
	// const state = url.searchParams.get('state')

	if (!client_id || typeof client_id !== 'string') {
		throw error(400, 'client_id is required');
	}

	const app = db.app.findUnique({
		where: {
			id: client_id
		}
	});

	if (!app) {
		throw error(404, `app not found!, ${client_id}, ${app}`);
	}

	throw redirect(302, `/a/${app.vanityCode}`);
};
