"use server"

import { creditPriceMap, CREDITS_PER_DOLLAR } from "@/constants"
import { redirect } from "next/navigation"
import Stripe from "stripe"
import { auth } from "../auth/auth"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { users } from "@/drizzle/schema"
import { stripe } from "@/lib/stripe"

export async function createCheckoutSession(params: {
    credits: number
}): Promise<{
    error?: string
    sessionUrl?: string
}> {
    const session = await auth()
    if (!session)
        return {
            error: "Unauthenticated",
        }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        typescript: true,
    })

    const { credits } = params

    if (credits !== 150 && credits !== 300 && credits !== 900)
        return {
            error: "Invalid amount",
        }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    userId: session.user.id,
                    credits,
                },
            },
            mode: "payment",
            line_items: [
                {
                    price: creditPriceMap[credits],
                    quantity: 1,
                },
            ],
            currency: "usd",
            success_url: `${process.env.NEXT_PUBLIC_URL}/buy-credits/?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/buy-credits/?canceled=true`,
        })

        if (!checkoutSession.url)
            return {
                error: "Error getting session url",
            }

        return {
            sessionUrl: checkoutSession.url,
        }
    } catch (e: any) {
        return {
            error: "Internal error",
        }
    }
}

export async function purchaseCredits(credits: number) {
    const session = await auth()
    if (!session) {
        redirect(`sign-in?redirect=buy-credits`)
    }
    console.log(credits)
    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    })
    if (!user) {
        redirect(`sign-in?redirect=buy-credits`)
    }
    const amountInCents = parseFloat((credits / CREDITS_PER_DOLLAR).toFixed(2)) * 100
    if (amountInCents < 1) return "Invalid amount"

    const checkoutSession = await stripe.checkout.sessions.create({
        client_reference_id: user.id,
        metadata: {
            credits: String(credits),
        },
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: "Wallet Funding",
                        description: `Funding your wallet with ${credits} credits`,
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            },
        ],
        currency: "usd",
        success_url: `${process.env.NEXT_PUBLIC_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/buy-credits?canceled=true`,
    })

    redirect(checkoutSession.url!)
}
