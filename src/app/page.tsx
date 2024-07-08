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
            <section id="overview">
                <h2 className="mb-2 text-xl font-semibold">Overview</h2>{" "}
                <p className="text-muted-foreground font-medium">
                    Mock TS Data AI generates realistic data based on a
                    Typescript Interface, using AI technology. Whether you need
                    test data or prototype data, our app provides you with
                    high-quality, believable data to meet your development
                    needs.
                </p>
                <h2 className="mb-2 text-xl font-semibold mt-8">
                    How it works
                </h2>
                <p className=" text-muted-foreground font-medium">
                    Just copy and paste your TypeScript interface into our app,
                    and let AI generate the data for you. This ensures that your
                    data looks real and is suitable for various testing and
                    development purposes.
                </p>
                <h2 className="mb-2 text-xl font-semibold mt-8">Pricing</h2>
                <p className=" text-muted-foreground font-medium">
                    You can see the pricing in{" "}
                    <Link
                        className="underline underline-offset-4"
                        href={"/buy-credits"}
                    >
                        buy credits page
                    </Link>
                    . Each new account comes with 5 free credits, allowing you
                    to experience our service without any initial cost. For
                    every 25 rows of data generated, 1 credit is used, making it
                    easy to manage and scale your data generation needs.
                </p>
            </section>
        </main>
    )
}
