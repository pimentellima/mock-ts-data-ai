"use client"
import * as SignIn from "@clerk/elements/sign-in"
import * as Clerk from "@clerk/elements/common"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Page() {
    return (
        <div className="flex justify-center ">
            <SignIn.Root>
                <SignIn.Step name="start">
                    <Card className="bg-primary-foreground">
                        <CardHeader>
                            <CardTitle>Sign in to your account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-x-2">
                                <Clerk.Connection asChild name="google">
                                    <Button>Sign in with Google</Button>
                                </Clerk.Connection>
                                <Clerk.Connection asChild name="github">
                                    <Button>Sign in with Github</Button>
                                </Clerk.Connection>
                            </div>
                            <Clerk.Field className="mt-3" name="identifier">
                                <Clerk.Label asChild>
                                    <Label>Email</Label>
                                </Clerk.Label>
                                <Clerk.Input asChild>
                                    <Input />
                                </Clerk.Input>
                                <Clerk.FieldError />
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
                                <SignIn.Action asChild submit>
                                    <Button>Continue</Button>
                                </SignIn.Action>
                            </div>
                        </CardContent>
                    </Card>
                </SignIn.Step>
                <SignIn.Step name="verifications">
                    <Card className="bg-primary-foreground">
                        <CardHeader>
                            <CardTitle>Check your email</CardTitle>
                            <CardDescription>
                                We've sent a code to your email address. Enter
                                it below to verify your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SignIn.Strategy name="email_code">
                                <Clerk.Field name="code">
                                    <Clerk.Label>Code</Clerk.Label>
                                    <Clerk.Input />
                                    <Clerk.FieldError>
                                        {({ message }) => (
                                            <p className="text-sm font-medium text-red-700">
                                                {message}
                                            </p>
                                        )}
                                    </Clerk.FieldError>
                                </Clerk.Field>
                                <SignIn.Action submit>Verify</SignIn.Action>
                            </SignIn.Strategy>
                        </CardContent>
                    </Card>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    )
}
