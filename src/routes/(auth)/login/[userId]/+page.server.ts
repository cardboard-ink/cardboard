import { db } from '$lib/server/database';
import type { GuildedVerificationSessions } from '@prisma/client';
import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
import { redirect } from '@sveltejs/kit';

export const load = async({params}) => {
  const userId = params.userId;
  if (!userId) {
    redirect(302, '/login');
  }
  await db.guildedVerificationSessions.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
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
  return {userId, userAuthToken};
}

export const actions = {
  check:async ({ cookies, request, params }) => {
    const userId = params.userId;
    const posts = await fetch(`https://www.guilded.gg/api/users/${userId}/posts?maxPosts=10`, {method: 'GET'})
    const data = await posts.json();
    const firstPostTitle = data[0].title
    db.guildedVerificationSessions.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        }
      }
    });
    let sessionAuthToken: GuildedVerificationSessions | string | undefined | null = await db.guildedVerificationSessions.findUnique({
      where: {
        userId
      }
    });
    if (!sessionAuthToken) {
      redirect(302, '/login');
    }
    sessionAuthToken = sessionAuthToken?.id;
    if (firstPostTitle !== sessionAuthToken) {
      const t: ToastSettings = {
        message: 'Could not authenticate you! Please check details & try again.',
        background: 'variant-filled-error',
        timeout: 3000,
      }
      toastStore.trigger(t);
      throw redirect(302, '/login');
    } 
    const t: ToastSettings = {
      message: 'Successfully authenticated you! Please wait for redirect!',
      background: 'variant-filled-success',
      timeout: 3000,
    }
    toastStore.trigger(t);
    let user = await db.guildedUser.findUnique({
      where: {
        id: userId,
      }
    })
    const me = await (await fetch(`https://www.guilded.gg/api/users/${userId}/profilev3`, {method: 'GET'})).json()
    if (!user) {
      user = await db.guildedUser.create({
        data: {
          id: userId,
          username: me.name,
          avatar: me.profilePictureLg ? me.profilePictureLg : undefined,
          banner: me.profileBannerLg ? me.profileBannerLg : undefined,
        }
      })
    } else {
      //update user
      user = await db.guildedUser.update({
        where: {
          id: userId,
        },
        data: {
          username: me.name,
          avatar: me.profilePictureLg ? me.profilePictureLg : undefined,
          banner: me.profileBannerLg ? me.profileBannerLg : undefined,
        }
      })
    }
    const session = await db.guildedAuthSession.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        userId: user.id,
      }
    })
    cookies.set('guildedAuthSession', session.id, {
			// send cookie for every page
			path: '/',
			// server side only cookie so you can't use `document.cookie`
			httpOnly: true,
			// only requests from same site can send cookies
			// https://developer.mozilla.org/en-US/docs/Glossary/CSRF
			sameSite: 'strict',
			// only sent over HTTPS in production
			secure: process.env.NODE_ENV === 'production',
			// set cookie to expire after a month
			maxAge: 60 * 60 * 24 * 30,
		})
    throw redirect(302, '/');
  }
}