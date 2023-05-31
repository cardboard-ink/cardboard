import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"

export const POST = async ({request}) => {
    const headers = request.headers
    let authToken = headers.get('authorization')
    if (!authToken || typeof authToken !== 'string') {
        throw error(400, 'invalid header')
    }
    if (!authToken.startsWith('Bearer ')) {
        throw error(400, 'invalid header format')
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
        throw error(401, 'invalid token')
    }
    const userId = verify.userAppManager.user.id
    const data = await fetch(`https://www.guilded.gg/api/users/${userId}/profilev3`, {method: 'GET'}).catch((e) => {
        throw error(500, `internal server error: ${e}`)
    })
    const userData = await data.json()
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
        userTransientStatus: userData.userTransientStatus,
    }
    return new Response(JSON.stringify(resData), {headers: {'Content-Type': 'application/json'}})
}