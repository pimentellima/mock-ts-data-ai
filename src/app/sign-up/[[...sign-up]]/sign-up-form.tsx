"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signup } from "../actions"
import { signupFormSchema } from "../schema"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function SignUpForm() {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof signupFormSchema>>({
        resolver: zodResolver(signupFormSchema),
        mode: "onSubmit",
    })

    const onSubmit = async (data: z.infer<typeof signupFormSchema>) => {
        const response = await signup(data)
        if (response.error) {
            toast({
                title: "Error",
                description: response.error,
                variant: "destructive",
            })
        }
        if (response.success) {
            router.push("/sign-in")
        }
    }

    return (
        <Card className="bg-primary-foreground">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div>
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        {!!form.formState.errors.email && (
                                            <FormMessage>
                                                {
                                                    form.formState.errors.email
                                                        .message
                                                }
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        {!!form.formState.errors.password && (
                                            <FormMessage>
                                                {
                                                    form.formState.errors
                                                        .password.message
                                                }
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="mt-3 flex justify-end">
                            <Button disabled={form.formState.isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="text-sm space-x-2">
                <p>Already have an account?</p>
                <Link className="underline-4 hover:underline" href={"/sign-in"}>
                    Sign in
                </Link>
            </CardFooter>
        </Card>
    )
}
