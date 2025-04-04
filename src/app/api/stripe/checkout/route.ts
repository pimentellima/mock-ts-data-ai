import { db } from "@/drizzle/db"
import { users } from "@/drizzle/schema"
import { stripe } from "@/lib/stripe"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
        throw new Error(
            "No session ID found in the request's search parameters."
        )
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        const userId = session.client_reference_id
        if (!userId) {
            throw new Error(
                "No user ID found in session's client_reference_id."
            )
        }
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: { credits: true },
        })

        if (!user) {
            throw new Error("User not found in the database.")
        }
        if (!session.metadata?.credits) {
            throw new Error("No credits found in session metadata.")
        }
        await db
            .update(users)
            .set({
                credits: user.credits + Number(session.metadata.credits),
            })
            .where(eq(users.id, userId))

        return NextResponse.redirect(new URL("/", request.url))
    } catch (error) {
        console.error("Error handling successful checkout:", error)
        return NextResponse.redirect(
            new URL("/buy-credits?error=true", request.url)
        )
    }
}
