import type { User } from '$lib/dtos/user';
import { guildedMediaLink } from '$lib/utils/guilded-media';
import { error, json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const userSearch = url.searchParams.get('query');
	console.log(userSearch);
	let users: User[] = [];
	const data = await (
		await fetch(
			`https://www.guilded.gg/api/search?query=${userSearch}&entityType=user&maxResultsPerType=20`,
			{ method: 'GET' }
		)
	).json();
	users = data.results.users;
	users = users.map((user: User) => {
		return {
			...user,
			profilePicture: guildedMediaLink(user.profilePicture ?? '/poop.png')
		};
	});
	return json(users);
};
