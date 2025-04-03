import { db } from "@/drizzle/db"
import { generationResults } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    { params }: { params: { generationId: string } }
) {
    try {
        /*         if (params.generationId === "default")
            return NextResponse.json(defaultResultJson) */
        const searchParams = new URL(req.url).searchParams
        const recordId = searchParams.get("record_id")
        const result = await db.query.generationResults.findFirst({
            with: {
                result: {
                    columns: {
                        apiEnabled: true,
                    },
                },
            },
            where: eq(generationResults.id, params.generationId),
        })
        if (!result) {
            return NextResponse.json(
                { message: "Result not found" },
                { status: 404 }
            )
        }

        if (!result.result.apiEnabled) {
            return NextResponse.json(
                { message: "API not enabled" },
                { status: 403 }
            )
        }
        const resultJson = recordId
            ? JSON.stringify(
                  (JSON.parse(result.json) as any[]).filter(
                      (res) => String(res.id) === recordId
                  )?.[0]
              )
            : result.json
        return NextResponse.json(resultJson)
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
