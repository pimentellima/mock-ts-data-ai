"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { User } from "@/types/next-auth"
import { useQuery } from "@tanstack/react-query"
import { UserIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { getLoggedUserCredits } from "./actions"

export default function UserDialog({
    user,
    userCredits,
}: {
    user: User
    userCredits?: number | null
}) {
    const [open, setOpen] = useState(false)
    const { data: credits } = useQuery({
        initialData: userCredits,
        queryFn: async () => await getLoggedUserCredits(),
        queryKey: ["credits"],
    })

    return (
        <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
            <DialogTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} alt="" />
                    <AvatarFallback>
                        <UserIcon />
                    </AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Account Info</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.image || ""} alt="" />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm">
                            <p>{user?.email || user?.name}</p>
                            <p>{`Remaining credits: ${credits}`}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex items-center justify-end">
                    <Button asChild variant={"link"}>
                        <Link
                            onClick={() => setOpen(false)}
                            href="/buy-credits"
                        >
                            Buy credits
                        </Link>
                    </Button>
                    <Button
                        variant={"link"}
                        onClick={() =>
                            signOut({ callbackUrl: "/sign-in", redirect: true })
                        }
                    >
                        Sign out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
