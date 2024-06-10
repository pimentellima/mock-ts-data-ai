"use client"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import CheckoutForm from "./checkout-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function Checkout() {
    return (
        <div>
            <Elements
                stripe={stripePromise}
                options={{ mode: "payment", amount: 500, currency: "usd" }}
            >
                <CheckoutForm />
            </Elements>
        </div>
    )
}
