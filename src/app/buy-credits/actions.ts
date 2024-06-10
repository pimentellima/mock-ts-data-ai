"use server"

import {  creditPriceMap } from "@/constants"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Stripe from "stripe"

export async function createCheckoutSession(params: {
    credits: number
}): Promise<{
    error?: string
    sessionUrl?: string
}> {
    const { userId } = auth()
    if (!userId)
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
                    userId,
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
