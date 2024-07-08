"use client"
import { format } from "date-fns"
import { results } from "@/drizzle/schema"
import { useInfiniteQuery } from "@tanstack/react-query"
import { InferSelectModel } from "drizzle-orm"
import { useSession } from "next-auth/react"
import { getResults } from "./actions"
import Result from "@/components/result"
import { Button } from "@/components/ui/button"

export default function ResultsInfiniteQuery({
    initialResults,
}: {
    initialResults: InferSelectModel<typeof results>[]
}) {
    const session = useSession()

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isFetching } =
        useInfiniteQuery<InferSelectModel<typeof results>[]>({
            initialData: { pages: [initialResults], pageParams: [1] },
            queryKey: ["results", session.data?.user.id],
            queryFn: async ({ pageParam = 1 }: { pageParam: unknown }) =>
                getResults(pageParam as number),
            initialPageParam: 1,
            getNextPageParam(lastPage, allPages) {
                return lastPage.length > 0 ? allPages.length + 1 : undefined
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        })

    return (
        <div className="flex flex-col gap-5">
            {data.pages.map((page) =>
                page.map((row) => (
                    <Result
                        key={row.id}
                        json={row.json}
                        createdAt={row.createdAt}
                        id={row.id}
                    />
                ))
            )}
            <div>
                <Button
                    variant={'ghost'}
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {isFetchingNextPage
                        ? "Loading more..."
                        : hasNextPage
                        ? "Load More"
                        : "Nothing more to load"}
                </Button>
            </div>
        </div>
    )
}
