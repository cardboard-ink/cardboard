import { db } from '$lib/server/database';
import { error } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { z } from 'sveltekit-api';
import type { RouteModifier } from 'sveltekit-api';

export const Modifier: RouteModifier = (r) => {
	r.operationId = 'login';
	r.security = [{ bearerAuth: [] }];
	return r;
};

export const Error = {
	400: error(400, 'invalid request'),
	401: error(401, 'invalid token'),
	500: error(500, 'internal server error')
};

export interface GuildedUser {
	id: string;
	name: string;
	subdomain?: string;
	aliases?: any;
	avatar?: string;
	banner?: string;
	userStatus?: any;
	moderationStatus: any;
	aboutInfo?: any;
	userTransientStatus: any;
	createdAt: any;
}

export const Output = z.object({
	id: z.string().describe('user id'),
	name: z.string().describe('user name'),
	subdomain: z.string().optional().describe('user subdomain'),
	aliases: z.any().optional().describe('user aliases'),
	avatar: z.string().optional().describe('user avatar'),
	banner: z.string().optional().describe('user banner'),
	createdAt: z.string().describe('user created at'),
	userStatus: z.any().optional().describe('user status'),
	moderationStatus: z.any().describe('user moderation status'),
	aboutInfo: z.any().optional().describe('user about info'),
	userTransientStatus: z.any().describe('user transient status')
});

export default async function (
	_: Record<never, never>,
	evt: RequestEvent
): Promise<z.infer<typeof Output>> {
	const headers = evt.request.headers;
	let authToken = headers.get('authorization');
	if (!authToken || typeof authToken !== 'string') {
		throw Error[400];
	}
	if (!authToken.startsWith('Bearer ')) {
		throw Error[400];
	}
	authToken = authToken.slice(7);
	const verify = await db.authorizedAppSession.findUnique({
		where: {
			authToken
		},
		select: {
			id: true,
			userAppManager: {
				select: {
					user: {
						select: {
							id: true
						}
					}
				}
			}
		}
	});
	if (!verify) {
		throw Error[401];
	}
	const userId = verify.userAppManager.user.id;
	const data = await fetch(`https://www.guilded.gg/api/users/${userId}/profilev3`, {
		method: 'GET'
	}).catch(() => {
		throw Error[500];
	});
	const userData = await data.json();
	const resData = {
		id: userData.id,
		name: userData.name,
		subdomain: userData.subdomain,
		aliases: userData.aliases,
		avatar: userData.profilePictureLg,
		banner: userData.profileBannerLg,
		createdAt: userData.joinedAt,
		userStatus: userData.userStatus,
		moderationStatus: userData.moderationStatus,
		aboutInfo: userData.aboutInfo,
		userTransientStatus: userData.userTransientStatus
	};
	return resData;
}
