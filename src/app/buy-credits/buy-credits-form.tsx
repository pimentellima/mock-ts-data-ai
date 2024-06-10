"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod"

const schema = z.object({ credits: z.enum(["150", "300", "500"]) })

export default function BuyCreditsForm({ isAuth }: { isAuth: boolean }) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: { credits: "300" },
    })

    return (
        <Form {...form}>
            <form>
                <FormField
                    name="credits"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Select the number of credits to buy (1 credit
                                per 25 itens generated)
                            </FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={(value) =>
                                        field.onChange(value)
                                    }
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={`Click here`}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="150">150</SelectItem>
                                        <SelectItem value="300">300</SelectItem>
                                        <SelectItem value="500">500</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex mt-1 justify-end">
                    {isAuth ? (
                        <Button variant={"secondary"}>
                            Checkout on stripe
                        </Button>
                    ) : (
                        <Dialog>
                            <DialogTrigger>Buy now</DialogTrigger>
                            <DialogContent className="flex items-center flex-col">
                                <DialogHeader>
                                    <DialogTitle>Not signed in</DialogTitle>
                                    <DialogDescription>
                                        You have to sign in to your account to
                                        buy credits
                                    </DialogDescription>
                                </DialogHeader>
                                <Link
                                    className="hover:underline underline-offset-4 text-sm"
                                    href="/sign-in"
                                >
                                    Sign in
                                </Link>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </form>
        </Form>
    )
}
