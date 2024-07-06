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
                    enableSystem={false}
                    attribute="class"
                    defaultTheme="dark"
                >
                    {children}
                </NextThemesProvider>
            </SessionProvider>
        </QueryClientProvider>
    )
}
