import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "@/constants"
import {
    createRefreshToken,
    extendRefreshToken,
    getRefreshToken,
} from "@/drizzle/tokens"
import { JWT } from "next-auth/jwt"

export async function obtainAccessToken(userId: string) {
    const refreshToken = await getRefreshToken(userId)
    if (!refreshToken) {
        return await createRefreshToken(userId)
    }

    return await extendRefreshToken(refreshToken.token, REFRESH_TOKEN_TTL)
}

export async function refreshAccessToken(
    token: JWT & { refreshToken: { token: string } }
) {
    const tokenInDb = await getRefreshToken(token.refreshToken.token)
    if (!tokenInDb) {
        throw new Error("Refresh token not found")
    }

    if (new Date() > tokenInDb.expires) {
        throw new Error("Refresh token expired")
    }

    const newToken = {
        ...token,
        expiresAt: new Date(Date.now() + ACCESS_TOKEN_TTL),
    }

    return newToken
}