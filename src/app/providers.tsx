"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    )
}
