import SignInForm from "./sign-in-form"
import { redirect } from "next/navigation"
import { auth } from "@/app/auth/auth"

export default async function Page({
    searchParams,
}: {
    searchParams: {
        redirectPathname?: string
    }
}) {
    const session = await auth()

    if (session?.user) {
        redirect("/")
    }

    return (
        <div className="flex justify-center ">
            <SignInForm redirectPathname={searchParams?.redirectPathname} />
        </div>
    )
}
