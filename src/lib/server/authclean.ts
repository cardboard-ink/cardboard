import { db } from "./database"

export const cleanupAuths = async () => {
    db.authorizedApp.deleteMany({
        where: {
            expiresAt: {
                lte: new Date()
            }
        }
    })
}