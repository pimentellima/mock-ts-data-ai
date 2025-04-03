import { auth } from "@/app/auth/auth"
import { Button } from "@/components/ui/button"
import { db } from "@/drizzle/db"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { CircleDollarSign, Home, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import NavbarButton from "./navbar-button"
import ToggleTheme from "./toggle-theme"
import UserDialog from "./user-dialog"

export default async function Navbar() {
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

    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: <Home className="h-4 w-4 mr-2" />,
        },
        {
            name: "Results",
            href: "/results",
            icon: <List className="h-4 w-4 mr-2" />,
        },
        {
            name: "Buy Credits",
            href: "/buy-credits",
            icon: <CircleDollarSign className="h-4 w-4 mr-2" />,
        },
    ]

    return (
        <nav className="sticky bg-background z-10 top-0 border-b">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-28 justify-between">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <Image
                        className="bg-black rounded-md p-0.5"
                        width={30}
                        height={30}
                        src="/logo.png"
                        alt="logo"
                    />
                    <span className="font-bold">Data Generator</span>
                </Link>
                <div className="flex items-center">
                    <div className="flex gap-2">
                        <ToggleTheme />
                        {navItems.map((item) => (
                            <NavbarButton
                                key={item.name}
                                href={item.href}
                                icon={item.icon}
                                name={item.name}
                            />
                        ))}
                        <Button variant={"ghost"} size="sm" asChild>
                            {user ? (
                                <UserDialog userCredits={userCredits} />
                            ) : (
                                <>
                                    <NavbarButton
                                        href={"/sign-in"}
                                        name={"Sign in"}
                                    />
                                    <NavbarButton
                                        href={"/sign-up"}
                                        name={"Sign up"}
                                    />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
