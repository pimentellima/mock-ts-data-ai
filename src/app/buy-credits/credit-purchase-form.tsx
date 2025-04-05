"use client"

import { useState, useEffect } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Loader2, CreditCard, Info } from "lucide-react"
import {
    CREDITS_PER_DOLLAR,
    ITEMS_PER_CREDIT,
    MIN_PURCHASE_DOLLARS,
} from "@/constants"
import { purchaseCredits } from "./actions"
import { useToast } from "@/components/ui/use-toast"
import CurrencyInput from "@/components/currency-input"

// Constants for credit pricing
const MIN_CREDITS = MIN_PURCHASE_DOLLARS * CREDITS_PER_DOLLAR
const MAX_CREDITS = 1000 * CREDITS_PER_DOLLAR

const formatPrice = (value: number) => {
    const formattedValue = value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    })
    return formattedValue
}

export function CreditPurchaseForm() {
    const [creditAmount, setCreditAmount] = useState(MIN_CREDITS)
    const { toast } = useToast()
    const [price, setPrice] = useState<string>(
        formatPrice(MIN_PURCHASE_DOLLARS)
    )
    const [isLoading, setIsLoading] = useState(false)

    const handlePriceChange = (newPrice: string) => {
        const numericPrice = Number.parseFloat(newPrice)
        const calculatedCredits = Math.floor(numericPrice * CREDITS_PER_DOLLAR)
        setCreditAmount(calculatedCredits)
        setPrice(formatPrice(numericPrice))
    }

    const handleCreditChange = (newCredits: number) => {
        setCreditAmount(newCredits)
        setPrice(formatPrice(newCredits / CREDITS_PER_DOLLAR))
    }

    const handlePurchase = async () => {
        setIsLoading(true)

        try {
            const error = await purchaseCredits(creditAmount)
            if (error) {
                toast({
                    title: "Error purchasing credits",
                    description: error,
                    variant: "destructive",
                })
                return
            }
        } catch (error) {
            toast({
                title: "Error purchasing credits",
                variant: "destructive",
            })
            console.error("Error purchasing credits:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const itemsGeneratable = creditAmount * ITEMS_PER_CREDIT

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Select Credits Amount</CardTitle>
                    <CardDescription>
                        Choose how many credits you want to purchase. 
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="price-amount">Credits</Label>
                        <Input
                            id="credit-amount"
                            type="number"
                            value={creditAmount}
                            onChange={(e) =>
                                handleCreditChange(
                                    Number.parseInt(e.target.value)
                                )
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            {creditAmount.toLocaleString()} credits ={" "}
                            {itemsGeneratable.toLocaleString()} items
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price-amount">Price (USD)</Label>
                        <CurrencyInput
                            id="price-amount"
                            value={price.toString()}
                            onChangeValue={(value) =>
                                handlePriceChange(value.replace(",", "."))
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            Minimum purchase: ${MIN_PURCHASE_DOLLARS.toFixed(2)}{" "}
                            USD ({MIN_CREDITS} credits)
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                    <div className="w-full p-4 bg-muted/30 rounded-md">
                        <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">
                                Credits
                            </span>
                            <span className="font-medium">
                                {creditAmount.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">
                                Items you can generate
                            </span>
                            <span className="font-medium">
                                {itemsGeneratable.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                            <span className="font-medium">Total</span>
                            <span className="font-bold">{`${price} USD`}</span>
                        </div>
                    </div>

                    <Button
                        onClick={handlePurchase}
                        disabled={isLoading || creditAmount < MIN_CREDITS}
                        className="w-full"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard />
                                Checkout on Stripe
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
