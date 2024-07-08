import { redirect } from "next/navigation"
import { auth } from "@/app/auth/auth"
import { db } from "@/drizzle/db"
import { desc, eq } from "drizzle-orm"
import { results } from "@/drizzle/schema"
import ResultsInfiniteQuery from "./results-inifinite-query"

export const ITEMS_PER_PAGE = 5

export default async function Page() {
    const session = await auth()

    if (!session?.user) {
        redirect("/")
    }

    const rows = await db.query.results.findMany({
        where: eq(results.userId, session.user.id),
        orderBy: [desc(results.createdAt)],
        limit: ITEMS_PER_PAGE,
    })

    return (
        <div className="flex flex-col justify-center gap-2 pt-4">
            {rows?.length && rows.length > 0 ? (
                <ResultsInfiniteQuery initialResults={rows} />
            ) : (
                <p className="text-center">No results.</p>
            )}
        </div>
    )
}
