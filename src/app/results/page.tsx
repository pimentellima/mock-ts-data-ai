import { Suspense } from "react"
import type { Metadata } from "next"
import ResultsList from "./results-list"
import ResultsPageSkeleton from "./results-page-skeleton"

export const metadata: Metadata = {
    title: "Generated Results | AI Prototype Data Generator",
    description:
        "View and manage your previously generated prototype data with pagination and filtering options.",
}

export default function ResultsPage({
    searchParams,
}: {
    searchParams: { page?: string }
}) {
    // Get the current page from the URL query parameters
    const currentPage = Number(searchParams.page) || 1

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Generated Results
                </h1>
                <p className="text-muted-foreground mt-2">
                    View and manage your previously generated prototype data
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
