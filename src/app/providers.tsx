"use client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <NextThemesProvider
                    attribute="class"
                    defaultTheme="system"
                    disableTransitionOnChange
                >
                    {children}
                </NextThemesProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}
