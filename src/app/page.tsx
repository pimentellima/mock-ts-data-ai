import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import DataGenerator from "../components/data-generator"

export default function Home() {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    AI Prototype Data Generator
                </h1>
                <p className="text-muted-foreground mt-2">
                    Generate realistic prototype data based on TypeScript
                    objects or interfaces
                </p>
            </header>
            <main>
                <DataGenerator />
            </main>
            <Separator className="my-10" />
            <section>
                <h2 className="mb-1 text-xl font-semibold">Overview</h2>{" "}
                <p className="text-sm text-muted-foreground font-medium">
                    Mock TS Data AI generates realistic data based on a
                    Typescript Interface, using AI technology. Whether you need
                    test data or prototype data, our app provides you with
                    high-quality, believable data to meet your development
                    needs.
                </p>
                <h2 className="mb-1 text-xl font-semibold mt-6">
                    How it works
                </h2>
                <p className=" text-sm text-muted-foreground font-medium">
                    Just copy and paste your TypeScript interface into our app,
                    and let AI generate the data for you. This ensures that your
                    data looks real and is suitable for various testing and
                    development purposes.
                </p>
                <h2 className="mb-1 text-xl font-semibold mt-6">Pricing</h2>
                <p className=" text-sm text-muted-foreground font-medium">
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
        </div>
    )
}
