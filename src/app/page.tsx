import GeneratorWrapper from "./generator-wrapper";

export default function Home() {
    return (
        <main className="flex flex-col justify-center h-full gap-2">
            <h1 className="text-3xl text-center tracking-tight font-semibold mt-5">
                Typescript to Mock Data Generator
            </h1>
            <GeneratorWrapper />
        </main>
    )
}
