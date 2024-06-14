import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { auth } from "@/app/auth/auth"
import SignUpForm from "./sign-up-form"

export default async function Page() {
    const session = await auth()

    if (session?.user) {
        redirect("/")
    }

    return (
        <div className="flex justify-center ">
            <SignUpForm />
        </div>
    )
}