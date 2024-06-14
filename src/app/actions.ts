"use server"

import { db } from "@/drizzle/db"
import { usage, users } from "@/drizzle/schema"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "./auth/auth"

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
            resultName: z.string(),
            json: z
                .string()
                .describe(
                    "The result of the mock data generation in JSON format. It should have the format specified in the typeDefinition and the length of the specified numberOfMocks for the resultName"
                ),
        })
    ),
})

export async function generateMockData(data: {
    types: {
        name: string
        typeDefinition: string
        numberOfMocks: string
    }[]
    description?: string
}): Promise<{
    error?: string
    result?: {
        resultName: string
        json: string
    }[]
}> {
    try {
        const session = await auth()
        if (!session) return { error: "Unauthenticated" }
        await db
            .insert(usage)
            .values({ userId: session.user.id })
            .onConflictDoNothing()

        const user = await db.query.users.findFirst({
            columns: { credits: true, id: true },
            where: eq(users.id, session.user.id),
        })

        const creditsUsage = data.types.reduce(
            (acc, curr) => acc + (curr.numberOfMocks === "25" ? 1 : 2),
            0
        )
        if (!user) return { error: "Error fetching user info" }

        if (creditsUsage > user.credits)
            return { error: "You don't have enough credits" }

        const prompt = `You will receive an array of typescript types or interfaces, a number of mocks and optionally a description and 
            will generate mock data based on those types. The output should format be an array of object with the resultName and the generated json.
            The output should look contain real world-like data.
            
            Input: ${JSON.stringify(data.types)} 
            ${`Description: ${data.description || "no description"}`}`

        const { object, usage: tokenUsage } = await generateObject({
            model: openai("gpt-3.5-turbo"),
            schema: outputSchema,
            prompt,
        })

        await db
            .update(usage)
            .set({ credits: user.credits - creditsUsage })
            .where(eq(users.id, user.id))
        return { result: object.results }
    } catch (e) {
        return { error: "Internal error" }
    }
}
