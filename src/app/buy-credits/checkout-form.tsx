"use client"
import { Button } from "@/components/ui/button"
import { useElements, useStripe } from "@stripe/react-stripe-js"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createCheckoutSession } from "./actions"
import { ITEMS_PER_CREDIT } from "@/constants"

const schema = z.object({ credits: z.enum(["150", "300", "900"]) })

const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
})

export default function CheckoutForm() {
    const stripe = useStripe()
    const elements = useElements()
    const router = useRouter()
    const { toast } = useToast()
    const session = useSession()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { credits: "300" },
    })

    const onSubmit = async () => {
        if (!session?.data?.user) {
            toast({
                title: "You have to be signed in to purchase credits",
                action: (
                    <Button asChild variant={"link"}>
                        <Link href={"sign-in/?redirectPathname=" + pathname}>
                            Sign in
                        </Link>
                    </Button>
                ),
            })
            return
        }
        const credits = form.getValues("credits")

        const res = await createCheckoutSession({
            credits: parseInt(credits),
        })

        if (res.error) {
            toast({
                title: "An error occurred",
                description: res.error,
                variant: "destructive",
            })
            return
        }
        if (!res.sessionUrl) {
            toast({
                title: "An error occurred",
                description: "No session url returned",
                variant: "destructive",
            })
            return
        }
        router.push(res.sessionUrl)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    name="credits"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                {`Select the number of credits to buy (Usage: ${ITEMS_PER_CREDIT}
                                itens generated per 1 credit)`}
                            </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        field.onChange(value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={`Click here`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="150">
                                            {`150 credits (${currency.format(
                                                2.5
                                            )})`}
                                        </SelectItem>
                                        <SelectItem value="300">
                                            {`300 credits (${currency.format(
                                                5
                                            )})`}
                                        </SelectItem>
                                        <SelectItem value="900">
                                            {`900 credits (${currency.format(
                                                15
                                            )})`}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex mt-3 justify-end">
                    <Button
                        className="flex items-center gap-1"
                        disabled={form.formState.isSubmitting}
                        variant={"default"}
                    >
                        Checkout on stripe
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </Form>
    )
}
