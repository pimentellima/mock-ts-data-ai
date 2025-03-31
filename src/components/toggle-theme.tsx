"use client"

import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ToggleTheme() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
        if (localStorage.getItem("theme") === "dark") {
            setTheme("dark")
        }
        if (localStorage.getItem("theme") === "light") {
            setTheme("light")
        }
    }, [])

    if (!mounted) return <></>

    return (
        <button
            title="toggle theme"
            onClick={() => {
                const newTheme = theme === "dark" ? "light" : "dark"
                localStorage.setItem("theme", newTheme)
                setTheme(newTheme)
            }}
        >
            {theme === "dark" ? (
                <MoonIcon className="h-5 w-5" />
            ) : (
                <SunIcon className="h-5 w-5" />
            )}
        </button>
    )
}
