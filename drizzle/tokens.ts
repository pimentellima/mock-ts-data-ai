import { db } from "@/drizzle/db"
import { refreshTokens } from "@/drizzle/schema"
import { eq } from "drizzle-orm"

const TOKEN_TTL = 2 * 24 * 60 * 60 * 1000

export async function createRefreshToken(userId: string) {
    const [token] = await db
        .insert(refreshTokens)
        .values({
            expires: new Date(Date.now() + TOKEN_TTL),
            userId,
        })
        .returning()
    return token
}

export async function extendRefreshToken(token: string, ttl: number) {
    const [refreshToken] = await db
        .update(refreshTokens)
        .set({
            expires: new Date(Date.now() + ttl),
        })
        .where(eq(refreshTokens.token, token))
        .returning()
    return refreshToken
}

export async function deleteRefreshTokens(userId: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId))
}

export async function getRefreshToken(token: string) {
    const refreshToken = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, token),
    })

    return refreshToken
}
