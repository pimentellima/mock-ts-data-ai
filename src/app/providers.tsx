"use client"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <NextThemesProvider
                attribute="class"
                defaultTheme="system"
                disableTransitionOnChange
            >
                {children}
            </NextThemesProvider>
        </ClerkProvider>
    )
}
