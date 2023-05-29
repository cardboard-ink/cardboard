import { db } from "./database"

export const cleanupAuths = async () => {
    await db.authorizedAppSession.deleteMany({
        where: {
            expiresAt: {
                lt: new Date(Date.now())
            }
        }
    })
}