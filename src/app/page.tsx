import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Generator from "./generator"

export default function Home() {
    return (
        <main className="flex flex-col justify-center gap-2">
            <h1 className="text-xl md:text-2xl text-center tracking-tight font-semibold mt-5">
                Typescript to Mock Data
                <br className="sm:hidden" /> Generator
            </h1>
            <Generator />
            <Separator className="my-10" />
            <section className="text-center tracking-tight" id="overview">
                <h2 className="text-xl md:text-2xl font-semibold">Overview</h2>{" "}
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                    Mock TS Data AI generates realistic data based on a
                    Typescript Interface, using AI technology.
                </p>
                <h2 className="text-xl md:text-2xl font-semibold mt-6">
                    How it works
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                    Simply copy and paste your TypeScript interface, and our app
                    will generate AI-powered data for you.
                </p>
                <h2 className="text-xl md:text-2xl font-semibold mt-6">
                    Pricing
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                    You can see the pricing in{" "}
                    <Link
                        className="underline underline-offset-4"
                        href={"/buy-credits"}
                    >
                        buy credits page
                    </Link>
                    . Every new account gets 5 credits for free. 1 credit is
                    used for each 25 rows of data generated.
                </p>
            </section>
        </main>
    )
}
