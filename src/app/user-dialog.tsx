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
                        <div className="">{user?.fullName}</div>
                    </div>
                    <div className="mt-2 flex flex-col">
                        {`Remaining credits: ${credits}`}
                        <Link
                            onClick={() => setOpen(false)}
                            href="/buy-credits"
                            className="hover:underline underline-offset-4"
                        >
                            Buy credits
                        </Link>
                    </div>
                </div>
                <DialogFooter>
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
