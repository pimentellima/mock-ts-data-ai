"use server"

import { results } from "@/drizzle/schema"
import { desc, eq, InferSelectModel, sql } from "drizzle-orm"
import { auth } from "../auth/auth"
import { db } from "@/drizzle/db"
import { ITEMS_PER_PAGE } from "@/constants"
import { ResultWithGenerations } from "@/types/types"

export async function deleteResultById(resultId: string) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }
    const result = await db.query.results.findFirst({
        where: eq(results.id, resultId),
    })
    if (result?.userId !== session.user.id) {
        throw new Error("Unauthorized")
    }
    await db.delete(results).where(eq(results.id, resultId))
}
export async function getResultsByPage(currentPage: number) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const rows = await db.query.results.findMany({
        where: eq(results.userId, session.user.id),
        limit: ITEMS_PER_PAGE,
        with: {
            generationResults: true,
        },
        offset: ITEMS_PER_PAGE * (currentPage - 1),
        orderBy: [desc(results.createdAt)],
    })

    return rows as ResultWithGenerations[]
}

export async function toggleApiStatus(resultId: string, apiEnabled: boolean) {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    await db.update(results).set({ apiEnabled }).where(eq(results.id, resultId))
}
export async function getResultsPageCount() {
    const session = await auth()
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const totalResults = await db
        .select({ count: sql<number>`count(*)` })
        .from(results)
        .where(eq(results.userId, session.user.id))
        .execute()

    return Math.ceil(totalResults[0].count / ITEMS_PER_PAGE)
}
