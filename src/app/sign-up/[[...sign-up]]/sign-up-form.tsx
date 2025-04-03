"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignUpForm() {
    const { toast } = useToast()
    const router = useRouter()

    return (
        <Card className="bg-primary-foreground">
            <CardHeader>
                <CardTitle>Sign up</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-x-2">
                    <Button
                        type="button"
                        onClick={async () => {
                            const result = await signIn("google", {
                                redirect: false,
                            })
                            if (result?.ok) {
                                router.push("/")
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
                        Sign up with Google
                    </Button>
                    <Button
                        type="button"
                        onClick={async () => {
                            const result = await signIn("github", {
                                redirect: false,
                            })
                            if (result?.ok) {
                                router.push("/")
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
                        Sign up with Github
                    </Button>
                </div>
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
