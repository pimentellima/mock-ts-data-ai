import GithubIcon from "@/components/github-icon"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import Providers from "./providers"
import UserDialog from "./user-dialog"
import { db } from "@/drizzle/db"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { auth } from "./auth/auth"
import ToggleTheme from "./toggle-theme"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Typescript Mock Data AI",
    description:
        "Generate mock/fake/test data for your typescript projects using AI.",
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth()

    const user = session ? session.user : null
    const userCredits = user
        ? (
              await db.query.users.findFirst({
                  columns: { credits: true },
                  where: eq(users.id, user.id),
              })
          )?.credits
        : null

    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Toaster />
                    <div className="min-h-screen flex flex-col justify-between">
                        <header
                            className="sticky top-0 h-14 py-2 border-b w-full bg-background
                            flex justify-between px-4 sm:px-10 md:px-40 z-10"
                        >
                            <Button asChild variant={"link"}>
                                <Link href="/">Generate</Link>
                            </Button>

                            <div className="flex items-center">
                                <ToggleTheme />
                                <Button asChild variant={"link"}>
                                    <Link href="/buy-credits">
                                        {" "}
                                        Buy credits
                                    </Link>
                                </Button>
                                {user ? (
                                    <>
                                        <Button asChild variant={"link"}>
                                            <Link href="/results">Results</Link>
                                        </Button>
                                        <UserDialog
                                            user={JSON.parse(
                                                JSON.stringify(user)
                                            )}
                                            userCredits={userCredits}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <Button asChild variant={"link"}>
                                            <Link href="/sign-in">Sign in</Link>
                                        </Button>
                                        <Button asChild variant={"link"}>
                                            <Link href="/sign-up">Sign up</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </header>
                        <div className="mx-4 sm:mx-10 md:mx-40">
                            {children}
                            <Analytics />
                        </div>
                        <footer
                            className="h-14 mt-10 border-t w-full 
                            flex items-center justify-between px-4 sm:px-10 md:px-40"
                        >
                            <p>
                                <span className="opacity-85">Created by </span>
                                <Link
                                    className="hover:underline underline-offset-4 opacity-85 hover:opacity-100"
                                    target="_blank"
                                    href={"https://github.com/pimentellima"}
                                >
                                    pimentellima
                                </Link>
                            </p>
                            <Link
                                className="opacity-85 hover:opacity-100"
                                target="_blank"
                                href={
                                    "https://github.com/pimentellima/mock-ts-data-ai"
                                }
                            >
                                <GithubIcon className="w-10 h-10 fill-primary" />
                            </Link>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}
