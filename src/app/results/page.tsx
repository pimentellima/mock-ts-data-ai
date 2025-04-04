import { Suspense } from "react"
import type { Metadata } from "next"
import ResultsList from "./results-list"
import ResultsPageSkeleton from "./results-page-skeleton"
import { auth } from "../auth/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Generated Results | AI Mock Data Generator",
    description:
        "View and manage your previously generated mock data with pagination and filtering options.",
}

export default async function ResultsPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    const session = await auth()
    if(!session) {
        redirect('/sign-in')
    }
    const currentPage = Number(searchParams.page) || 1

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Generated Results
                </h1>
                <p className="text-muted-foreground mt-2">
                    View and manage your previously generated mock data
                </p>
            </header>

            <main>
                <Suspense fallback={<ResultsPageSkeleton />}>
                    <ResultsList currentPage={currentPage} />
                </Suspense>
            </main>
        </div>
    )
}
