import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Currency, Database, Home, List } from "lucide-react"
import ToggleTheme from "./toggle-theme"
import { auth } from "@/app/auth/auth"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { users } from "@/drizzle/schema"
import UserDialog from "./user-dialog"
import NavbarButton from "./navbar-button"

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
            icon: <Currency className="h-4 w-4 mr-2" />,
        },
    ]

    return (
        <nav className="sticky bg-background z-10 top-0 border-b">
            <div className="container mx-auto flex h-16 items-center px-4 md:px-28 justify-between">
                <Link href="/" className="flex items-center gap-2 mr-6">
                    <Database className="h-6 w-6" />
                    <span className="font-bold">Data Generator</span>
                </Link>
                <div className="flex items-center gap-4">
                    <ToggleTheme />
                    <div className="flex gap-2">
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
                                <UserDialog
                                    user={JSON.parse(JSON.stringify(user))}
                                    userCredits={userCredits}
                                />
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
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
