import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import Stripe from "stripe"
import Checkout from "./checkout"
import { auth } from "../auth/auth"

const paymentStatusMessage: Record<Stripe.Checkout.Session.Status, string> = {
    complete: "Payment complete",
    expired: "Payment expired",
    open: "Payment open",
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
})

export default async function Page({
    searchParams,
}: {
    searchParams: {
        session_id?: string
        canceled?: "true" | "false"
    }
}) {
    const session = await auth()

    const checkoutSession = searchParams.session_id
        ? await stripe.checkout.sessions.retrieve(searchParams.session_id)
        : null

    if (searchParams.canceled === "true")
        return (
            <div className="flex justify-center items-center">
                <Card className="bg-primary-foreground">
                    <CardHeader>
                        <CardTitle>Purchase details</CardTitle>
                        <CardDescription>Payment canceled</CardDescription>
                    </CardHeader>

                    <CardFooter className="flex justify-end">
                        <Button variant={"link"} asChild>
                            <Link href={"/"}>Go back</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )

    if (checkoutSession?.status)
        return (
            <div className="flex justify-center items-center">
                <Card className="bg-primary-foreground">
                    <CardHeader>
                        <CardTitle>Purchase details</CardTitle>
                        <CardDescription>
                            {paymentStatusMessage[checkoutSession.status]}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <div>
                            {checkoutSession.status === "complete"
                                ? "The credits have been successfully deposited into your account."
                                : "Refresh the page to update the details"}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button variant={"link"} asChild>
                            <Link href={"/"}>Go back</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )

    return (
        <div className="flex justify-center items-center">
            <Card className="bg-primary-foreground">
                <CardHeader>
                    <CardTitle>Buy credits</CardTitle>
                    <CardDescription>
                        Add credits to your account to use to generate data
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                    {session ? (
                        <Checkout />
                    ) : (
                        <div>
                            <p>You need to sign in to buy credits.</p>
                            <div className="flex mt-2 justify-end">
                                <Button asChild>
                                    <Link href={"sign-in"}>Sign in</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
