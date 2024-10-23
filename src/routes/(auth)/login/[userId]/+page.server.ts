import { db } from '$lib/server/database';
import { guildedMediaLink } from '$lib/utils/guilded-media';
import type { GuildedVerificationSessions } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const userId = params.userId;
	if (!userId) {
		redirect(302, '/login');
	}
	await db.guildedVerificationSessions.deleteMany({
		where: {
			expiresAt: {
				lte: new Date()
			}
		}
	});
	const sessionAuthToken = await db.guildedVerificationSessions.findUnique({
		where: {
			userId
		}
	});
	if (!sessionAuthToken) {
		redirect(302, '/login');
	}
	const userAuthToken = sessionAuthToken?.id;
	return { userId, userAuthToken };
};

export const actions = {
	check: async ({ cookies, params, url }) => {
		const userId = params.userId;
		const posts =
			(await fetch(`https://www.guilded.gg/api/users/${userId}/posts?maxPosts=10`, {
				method: 'GET'
			})) || null;
		if (!posts) {
			error(
				400,
				'Could not find your Guilded Posts. Have you posted on your guilded profile page?'
			);
		}
		const data = await posts.json().catch((e) => {
			error(
				400,
				`Your posts couldnt be converted to a readable format, this is a guilded error, pls try later:\n${e}`
			);
		});
		if (!data) {
			error(
				400,
				'Could not get data of your Guilded Posts. Are your recent posts using any sort of bugs? Please delete them if they are.'
			);
		}
		if (!data[0].title) {
			error(
				400,
				'Your most recent post does not have the aforementioned title, please ensure it does.'
			);
		}
		const firstPostTitle = data[0].title;
		if (!data[0].createdBy) {
			error(400, 'Your most recent post has not been created by you, please ensure it has been.');
		}
		const createdBy = data[0].createdBy;
		if (createdBy !== userId) {
			error(
				403,
				'Please make sure you create the post with the account you are trying to verify!'
			);
		}
		db.guildedVerificationSessions.deleteMany({
			where: {
				expiresAt: {
					lte: new Date()
				}
			}
		});
		let sessionAuthToken: GuildedVerificationSessions | string | undefined | null =
			await db.guildedVerificationSessions.findUnique({
				where: {
					userId
				}
			});
		if (!sessionAuthToken) {
			redirect(302, '/login');
		}
		sessionAuthToken = sessionAuthToken?.id;
		if (firstPostTitle !== sessionAuthToken) {
			redirect(302, '/login');
		}
		let user = await db.guildedUser.findUnique({
			where: {
				id: userId
			}
		});
		const me = await (
			await fetch(`https://www.guilded.gg/api/users/${userId}/profilev3`, { method: 'GET' })
		).json();
		if (!user) {
			user = await db.guildedUser.create({
				data: {
					id: userId,
					username: me.name,
					avatar: me.profilePictureLg ? guildedMediaLink(me.profilePictureLg) : undefined,
					banner: me.profileBannerLg ? guildedMediaLink(me.profileBannerLg) : undefined
				}
			});
		} else {
			//update user
			user = await db.guildedUser.update({
				where: {
					id: userId
				},
				data: {
					username: me.name,
					avatar: me.profilePictureLg ? guildedMediaLink(me.profilePictureLg) : undefined,
					banner: me.profileBannerLg ? guildedMediaLink(me.profileBannerLg) : undefined
				}
			});
		}
		const session = await db.guildedAuthSession.create({
			data: {
				expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
				userId: user.id
			}
		});
		cookies.set('guildedAuthSession', session.id, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'lax',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30
		});
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo) {
			redirect(302, `/${redirectTo.slice(1)}`);
		}
		redirect(302, '/');
	}
};
