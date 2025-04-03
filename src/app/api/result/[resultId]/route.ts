import { db } from "@/drizzle/db"
import { results } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    { params }: { params: { resultId: string } }
) {
    try {
        const body = await req.json()
        if (!body.apiEnabled) {
            return NextResponse.json(
                { message: "Invalid params" },
                { status: 400 }
            )
        }
        const resultId = params.resultId
        await db
            .update(results)
            .set({ apiEnabled: body.apiEnabled })
            .where(eq(results.id, resultId))
        return NextResponse.json({ status: 201 })
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
