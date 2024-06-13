"use client"
import * as SignUp from "@clerk/elements/sign-up"
import * as Clerk from "@clerk/elements/common"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { initialCredits } from "@/constants"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FormMessage } from "@/components/ui/form"

export default function Page() {
    return (
        <div className="flex justify-center ">
            <SignUp.Root>
                <SignUp.Root>
                    <SignUp.Step name="start">
                        <Card className="bg-primary-foreground">
                            <CardHeader>
                                <CardTitle>Create an account</CardTitle>
                                <CardDescription>{`Create a new account and get ${initialCredits} credits`}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-x-2">
                                    <Clerk.Connection asChild name="google">
                                        <Button>Sign up with Google</Button>
                                    </Clerk.Connection>
                                    <Clerk.Connection asChild name="github">
                                        <Button>Sign up with Github</Button>
                                    </Clerk.Connection>
                                </div>
                                <Clerk.Field className="mt-6" name="emailAddress">
                                    <Clerk.Label asChild>
                                        <Label>Email</Label>
                                    </Clerk.Label>
                                    <Clerk.Input asChild>
                                        <Input />
                                    </Clerk.Input>
                                    <Clerk.FieldError>
                                        {({ message }) => (
                                            <p className="text-sm font-medium text-red-700">
                                                {message}
                                            </p>
                                        )}
                                    </Clerk.FieldError>
                                </Clerk.Field>
                                <Clerk.Field name="password">
                                    <Clerk.Label asChild>
                                        <Label>Password</Label>
                                    </Clerk.Label>
                                    <Clerk.Input asChild>
                                        <Input />
                                    </Clerk.Input>
                                    <Clerk.FieldError>
                                        {({ message }) => (
                                            <p className="text-sm font-medium text-red-700">
                                                {message}
                                            </p>
                                        )}
                                    </Clerk.FieldError>
                                </Clerk.Field>
                                <div className="mt-3 flex justify-end">
                                    <SignUp.Action asChild submit>
                                        <Button>Continue</Button>
                                    </SignUp.Action>
                                </div>
                            </CardContent>
                        </Card>
                    </SignUp.Step>
                    <SignUp.Step name="verifications">
                        <Card className="bg-primary-foreground">
                            <CardHeader>
                                <CardTitle>Check your email</CardTitle>
                                <CardDescription>
                                    We've sent a code to your email address.
                                    Enter it below to verify your account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SignUp.Strategy name="email_code">
                                    <Clerk.Field name="code">
                                        <Clerk.Label asChild>
                                            <Label>Code</Label>
                                        </Clerk.Label>
                                        <Clerk.Input asChild>
                                            <Input />
                                        </Clerk.Input>
                                        <Clerk.FieldError>
                                            {({ message }) => (
                                                <p className="text-sm font-medium text-red-700">
                                                    {message}
                                                </p>
                                            )}
                                        </Clerk.FieldError>
                                    </Clerk.Field>
                                    <div className="mt-3 flex gap-1 justify-end">
                                        <SignUp.Action asChild submit>
                                            <Button>Verify</Button>
                                        </SignUp.Action>
                                    </div>
                                </SignUp.Strategy>
                            </CardContent>
                        </Card>
                    </SignUp.Step>
                </SignUp.Root>
            </SignUp.Root>
        </div>
    )
}
