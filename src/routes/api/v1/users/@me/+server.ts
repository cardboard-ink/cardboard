import { db } from "$lib/server/database"
import { guildedMediaLink } from "$lib/utils/guilded-media"
import { error } from "@sveltejs/kit"

export const GET = async ({request}) => {
    const headers = request.headers
    let authToken = headers.get('authorization')
    if (!authToken || typeof authToken !== 'string') {
        error(400, 'invalid header');
    }
    if (!authToken.startsWith('Bearer ')) {
        error(400, 'invalid header format');
    }
    authToken = authToken.slice(7)
    const verify = await db.authorizedAppSession.findUnique({
        where: {
            authToken,
        },
        select: {
            id: true,
            userAppManager: {
                select: {
                    user: {
                        select: {
                            id: true,
                        }
                    }   
                }   
            }
        }
    })
    if (!verify) {
        error(401, 'invalid token');
    }
    const userId = verify.userAppManager.user.id
    const data = await fetch(`https://www.guilded.gg/api/users/${userId}/profilev3`, {method: 'GET'}).catch((e) => {
        error(500, `internal server error: ${e}`);
    })
    const userData = await data.json()
    const resData = {
        id: userData.id,
        name: userData.name,
        subdomain: userData.subdomain,
        aliases: userData.aliases,
        avatar: guildedMediaLink(userData.profilePictureLg),
        banner: guildedMediaLink(userData.profileBannerLg),
        createdAt: userData.joinedAt,
        userStatus: userData.userStatus,
        moderationStatus: userData.moderationStatus,
        aboutInfo: userData.aboutInfo,
        userTransientStatus: userData.userTransientStatus,
    }
    return new Response(JSON.stringify(resData), {headers: {'Content-Type': 'application/json'}})
}