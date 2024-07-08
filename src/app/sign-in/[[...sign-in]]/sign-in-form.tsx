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
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signInFormSchema } from "../schema"
import Link from "next/link"

export default function SignInForm({
    redirectPathname,
}: {
    redirectPathname?: string
}) {
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        mode: "onSubmit",
    })

    const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
        const { email, password } = data
        const response = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (response?.error) {
            toast({
                title: "Error signing in",
                description: response.error,
                variant: "destructive",
            })
            return
        }

        router.push(redirectPathname || "/")
        router.refresh()
    }

    return (
        <Card className="bg-primary-foreground">
            <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-x-2">
                            <Button
                                type="button"
                                onClick={async () => {
                                    const result = await signIn("google", {
                                        redirect: false,
                                    })
                                    if (result?.ok) {
                                        router.push(redirectPathname || "/")
                                    }
                                    if (result?.error) {
                                        toast({
                                            title: "Error signing in",
                                            description: result?.error,
                                            variant: "destructive",
                                        })
                                    }
                                }}
                            >
                                Sign in with Google
                            </Button>
                            <Button
                                type="button"
                                onClick={async () => {
                                    const result = await signIn("github", {
                                        redirect: false,
                                    })
                                    if (result?.ok) {
                                        router.push(redirectPathname || "/")
                                    }
                                    if (result?.error) {
                                        toast({
                                            title: "Error signing in",
                                            description: result?.error,
                                            variant: "destructive",
                                        })
                                    }
                                }}
                            >
                                Sign in with Github
                            </Button>
                        </div>
                        <div className="mt-3">
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
                <p>Doesn't have an account?</p>
                <Link className="underline-4 hover:underline" href={"/sign-up"}>
                    Sign up
                </Link>
            </CardFooter>
        </Card>
    )
}
