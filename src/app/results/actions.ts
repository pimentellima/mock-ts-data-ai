"use server"

import { results } from "@/drizzle/schema"
import { desc, eq, InferSelectModel } from "drizzle-orm"
import { auth } from "../auth/auth"
import { db } from "@/drizzle/db"
import { ITEMS_PER_PAGE } from "./page"

export async function getResults(pageParam: number) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const rows = await db.query.results.findMany({
        where: eq(results.userId, session.user.id),
        limit: ITEMS_PER_PAGE,
        orderBy: [desc(results.createdAt)],
        offset: ITEMS_PER_PAGE * (pageParam - 1),
    })
    return rows as InferSelectModel<typeof results>[]
}
