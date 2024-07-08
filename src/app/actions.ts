"use server"

import { db } from "@/drizzle/db"
import { results, users } from "@/drizzle/schema"
import { openai } from "@ai-sdk/openai"
import { generateObject, generateText } from "ai"
import { eq } from "drizzle-orm"
import { number, z } from "zod"
import { auth } from "./auth/auth"
import { isArray } from "util"

export async function getLoggedUserCredits() {
    const session = await auth()
    if (!session) return null
    const user = await db.query.users.findFirst({
        columns: { credits: true },
        where: eq(users.id, session.user.id),
    })
    if (!user) return null
    return user.credits
}

const outputSchema = z.object({
    results: z.array(
        z.object({
            resultName: z
                .string()
                .describe("It should match the name of the type entry"),
            json: z
                .string()
                .describe(
                    "The result of the generated data. It should be an array in the json format."
                ),
        })
    ),
})

export async function generateMockData({
    numberOfMocks,
    typeDefinition,
    description,
}: {
    typeDefinition: string
    numberOfMocks: string
    description?: string
}): Promise<
    | { jsonString?: never; resultId?: never; error: string }
    | { jsonString: string; resultId: string; error?: never }
> {
    try {
        const session = await auth()
        if (!session?.user.id) return { error: "Unauthenticated" }

        const user = await db.query.users.findFirst({
            columns: { credits: true, id: true },
            where: eq(users.id, session.user.id),
        })

        if (!user) return { error: "Error fetching user information" }

        const creditsUsage = Number(numberOfMocks) / 25

        if (creditsUsage > user.credits)
            return { error: "You don't have enough credits" }

        const prompt = `Type/interface: ${typeDefinition}; Number of itens to generate: ${numberOfMocks}; Description: ${
            description || "no description"
        }`

        const { text, usage: tokenUsage } = await generateText({
            model: openai("gpt-3.5-turbo"),
            system: "You are a bot that generates data that looks like real world data in json format based on a typescript type/interface. The data you generate should match the first type in Type/interface.",
            prompt,
        })
        try {
            JSON.parse(text)
        } catch {
            return { error: "Error generating data. No credits were used." }
        }

        const [insertedResult] = await db
            .insert(results)
            .values({ json: text, userId: user.id })
            .returning()

        await db
            .update(users)
            .set({ credits: user.credits - creditsUsage })
            .where(eq(users.id, user.id))
        return {
            jsonString: text,
            resultId: insertedResult.id,
        }
    } catch (e) {
        return { error: "Internal error" }
    }
}
