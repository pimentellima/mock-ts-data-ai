import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import Link from "next/link"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import GithubIcon from "@/components/github-icon"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <div className="min-h-screen flex flex-col justify-between mx-40">
                        <Toaster />
                        {children}
                        <footer
                            className="h-20 mt-5 px-5 border-t w-full 
                            flex items-center justify-between"
                        >
                            <p>
                                <span className="opacity-85">
                                    Created with ❤️ by{" "}
                                </span>
                                <Link
                                    href={"https://github.com/pimentellima"}
                                    className="text-primary opacity-85 hover:opacity-100
                                transition-opacity hover:underline underline-offset-2"
                                >
                                    pimentellima
                                </Link>
                                .
                            </p>
                            <Link
                                href={"https://github.com/pimentellima"}
                                className="text-white hover:opacity-100 opacity-70
                                transition-opacity"
                            >
                                <GithubIcon className="w-10 h-10 fill-black dark:fill-white" />
                            </Link>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    )
}