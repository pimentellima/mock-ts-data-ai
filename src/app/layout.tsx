import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Typescript Mock Data AI",
    description:
        "Generate mock/fake/test data for your typescript projects using AI.",
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
                    <div className="min-h-screen flex flex-col justify-between">
                        <Navbar />
                        <div className="mx-4 sm:mx-10 md:mx-40">
                            {children}
                            <Toaster />
                            <Analytics />
                        </div>
                        <div />
                    </div>
                </Providers>
            </body>
        </html>
    )
}
