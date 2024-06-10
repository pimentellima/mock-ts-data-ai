import { db } from "@/drizzle/db"
import { usage } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

const secret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = headers().get("stripe-signature")
        if (!signature)
            return NextResponse.json(
                { message: "No stripe signature" },
                { status: 400 }
            )
        const event = stripe.webhooks.constructEvent(body, signature, secret)

        if (event.type === "payment_intent.succeeded") {
            const userId = event.data.object.metadata.userId as
                | string
                | undefined
            if (!userId)
                return NextResponse.json(
                    { message: "User id not found in object metadata" },
                    { status: 500 }
                )

            const credits = event.data.object.metadata.credits as
                | string
                | undefined

            if (!credits) {
                return NextResponse.json(null, { status: 500 })
            }

            await db.insert(usage).values({ userId }).onConflictDoNothing()
            const userUsage = await db.query.usage.findFirst({
                where: eq(usage.userId, userId),
                columns: { credits: true },
            })

            if (!userUsage)
                return NextResponse.json(
                    { message: "Error updating user usage" },
                    { status: 500 }
                )

            await db
                .update(usage)
                .set({ credits: userUsage.credits + Number(credits) })
                .where(eq(usage.userId, userId))
        }

        return NextResponse.json({ result: event, ok: true })
    } catch (error) {
        return NextResponse.json(
            {
                message: "Internal error",
                error,
            },
            { status: 500 }
        )
    }
}
