"use client"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"

export default function NavbarButton({
    href,
    icon,
    name,
}: {
    href: string
    icon?: React.ReactNode
    name: string
}) {
    const pathname = usePathname()
    const isActive = pathname === href
    return (
        <Button variant={isActive ? "secondary" : "ghost"} size="sm" asChild>
            <Link href={href} className="flex items-center">
                {icon}
                {name}
            </Link>
        </Button>
    )
}
