import { db } from "./database"

export const cleanupAuths = async () => {
    console.log('cleaning up auths')
    await db.authorizedAppSession.deleteMany({
        where: {
            expiresAt: {
                lte: new Date()
            }
        }
    })
}