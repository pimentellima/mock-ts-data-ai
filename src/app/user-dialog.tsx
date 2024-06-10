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
import { useClerk } from "@clerk/nextjs"
import { User } from "@clerk/nextjs/server"
import { useQuery } from "@tanstack/react-query"
import { UserIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { getUserCredits } from "./actions"

export default function UserDialog({
    user,
    userCredits,
}: {
    user: User
    userCredits: number
}) {
    const [open, setOpen] = useState(false)
    const { signOut } = useClerk()
    const { data: credits } = useQuery({
        initialData: userCredits,
        queryFn: async () => await getUserCredits(),
        queryKey: ["user credits", user.id],
    })

    return (
        <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
            <DialogTrigger>
                <Avatar>
                    <AvatarImage src={user?.imageUrl} alt="" />
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
                            <AvatarImage src={user?.imageUrl} alt="" />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm">
                            <p>{user?.firstName}</p>
                            <p>{`Remaining credits: ${credits}`}</p>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex gap-2 items-center justify-end">
                    <Link
                        onClick={() => setOpen(false)}
                        href="/buy-credits"
                        className="hover:underline underline-offset-4"
                    >
                        Buy credits
                    </Link>
                    <Button
                        variant={"secondary"}
                        onClick={() => signOut({ redirectUrl: "/" })}
                    >
                        Sign out
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
