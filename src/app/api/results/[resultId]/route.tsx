import { defaultResultJson } from "@/constants"
import { db } from "@/drizzle/db"
import { results } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { resultId: string } }
) {
    try {
        if (params.resultId === "default")
            return NextResponse.json(
                JSON.stringify(JSON.parse(defaultResultJson), null, 0)
            )
        const result = await db.query.results.findFirst({
            where: eq(results.id, params.resultId),
        })
        if (!result) {
            return NextResponse.json(
                { message: "Result not found" },
                { status: 404 }
            )
        }
        return NextResponse.json(
            JSON.stringify(JSON.parse(result.json), null, 0)
        )
    } catch (error) {
        return NextResponse.json(
            {
                message: "Internal error",
                error,
            },
            { status: 500 }
        )
    }
}
