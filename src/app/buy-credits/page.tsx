import type { Metadata } from "next"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { CreditPurchaseForm } from "./credit-purchase-form"

export const metadata: Metadata = {
    title: "Buy Credits | AI Prototype Data Generator",
    description:
        "Purchase credits to generate more prototype data and use advanced features.",
}

export default function BuyCreditsPage({
    searchParams,
}: {
    searchParams: {
        canceled?: string
        error?: string
        success?: string
    }
}) {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Buy Credits
                </h1>
                <p className="text-muted-foreground mt-2">
                    Purchase credits to generate more prototype data and use
                    advanced features
                </p>
            </div>

            <main>
                {searchParams.success === "true" && (
                    <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertTitle>Payment Successful</AlertTitle>
                        <AlertDescription>
                            Thank you for your purchase! Your credits have been
                            added to your account.
                        </AlertDescription>
                    </Alert>
                )}

                {searchParams.canceled === "true" && (
                    <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertTitle>Payment Canceled</AlertTitle>
                        <AlertDescription>
                            Your payment was canceled. No charges were made to
                            your account.
                        </AlertDescription>
                    </Alert>
                )}

                {searchParams.error === "true" && (
                    <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle>Payment Error</AlertTitle>
                        <AlertDescription>
                            There was an error processing your payment. Please
                            try again or contact support.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="md:col-span-2">
                        <CreditPurchaseForm />
                    </div>
                </div>
            </main>
        </div>
    )
}
