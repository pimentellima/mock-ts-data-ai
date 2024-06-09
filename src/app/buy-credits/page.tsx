import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"

export default function Page() {
    const { userId } = auth()

    return (
        <div className="flex justify-center items-center">
            <Card className="bg-primary-foreground">
                <CardHeader>
                    <CardTitle>Buy credits</CardTitle>
                    <CardDescription>300 Credits ($5)</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Usage per call: 1 credit per 25 itens generated</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    {userId ? (
                        <Link
                            href={""}
                            className="p-3 text-sm text-primary bg-secondary"
                        >
                            Buy now
                        </Link>
                    ) : (
                        <Dialog>
                            <DialogTrigger className="p-3 text-sm text-primary bg-secondary">
                                Buy now
                            </DialogTrigger>
                            <DialogContent className="flex items-center flex-col">
                                <DialogHeader>
                                    <DialogTitle>Not signed in</DialogTitle>
                                    <DialogDescription>
                                        You have to sign in to your account to
                                        buy credits
                                    </DialogDescription>
                                </DialogHeader>
                                <Link
                                    className="p-3 text-sm text-primary bg-secondary"
                                    href="/sign-in"
                                >
                                    Sign in
                                </Link>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
