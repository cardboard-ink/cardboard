import { db } from '$lib/server/database';
import { guildedMediaLink } from '$lib/utils/guilded-media';
import type { GuildedVerificationSessions } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const userId = params.userId;
  if (!userId) {
    throw redirect(302, '/login');
  }

  try {
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
      throw redirect(302, '/login');
    }

    const userAuthToken = sessionAuthToken?.id;
    return { userId, userAuthToken };
  } catch (err) {
    throw error(500, 'An error occurred while loading the session.');
  }
}

export const actions = {
  check: async ({ cookies, params, url }) => {
    const userId = params.userId;

    try {
      const posts = await fetch(`https://www.guilded.gg/api/users/${userId}/posts?maxPosts=10`, { method: 'GET' });
      const data = await posts.json();

      if (!data.length) {
        throw error(404, 'No posts found for this user.');
      }

      const firstPostTitle = data[0]?.title;
      const createdBy = data[0]?.createdBy;

      if (createdBy !== userId) {
        throw error(403, 'Please make sure you create the post with the account you are trying to verify! For security purposes, this incident has been reported to the account owner.');
      }

      await db.guildedVerificationSessions.deleteMany({
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
        throw redirect(302, '/login');
      }

      sessionAuthToken = sessionAuthToken?.id;
      if (firstPostTitle !== sessionAuthToken) {
        throw redirect(302, '/login');
      }

      let user = await db.guildedUser.findUnique({
        where: {
          id: userId,
        }
      });

      const me = await (await fetch(`https://www.guilded.gg/api/users/${userId}/profilev3`, { method: 'GET' })).json();

      if (!user) {
        user = await db.guildedUser.create({
          data: {
            id: userId,
            username: me.name,
            avatar: me.profilePictureLg ? guildedMediaLink(me.profilePictureLg) : undefined,
            banner: me.profileBannerLg ? guildedMediaLink(me.profileBannerLg) : undefined,
          }
        });
      } else {
        // Update user
        user = await db.guildedUser.update({
          where: {
            id: userId,
          },
          data: {
            username: me.name,
            avatar: me.profilePictureLg ? guildedMediaLink(me.profilePictureLg) : undefined,
            banner: me.profileBannerLg ? guildedMediaLink(me.profileBannerLg) : undefined,
          }
        });
      }

      const session = await db.guildedAuthSession.create({
        data: {
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          userId: user.id,
        }
      });

      cookies.set('guildedAuthSession', session.id, {
        // Send cookie for every page
        path: '/',
        // Server side only cookie so you can't use `document.cookie`
        httpOnly: true,
        // Only requests from same site can send cookies
        sameSite: 'lax',
        // Only sent over HTTPS in production
        secure: process.env.NODE_ENV === 'production',
        // Set cookie to expire after a month
        maxAge: 60 * 60 * 24 * 30,
      });

      const redirectTo = url.searchParams.get('redirectTo');
      if (redirectTo) {
        throw redirect(302, `/${redirectTo.slice(1)}`);
      }

      throw redirect(302, '/');
    } catch (err) {
      throw error(500, 'An error occurred during the verification process.');
    }
  }
};