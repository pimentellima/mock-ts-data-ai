"use server"

import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { usage } from "@/drizzle/schema"
import { formSchema } from "./mock-data-form"
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { db } from "@/drizzle/db"
import { eq } from "drizzle-orm"
import { initialCredits } from "@/constants"

export async function getUserCredits() {
    const user = await currentUser()
    if (!user) return null
    const userUsage = await db.query.usage.findFirst({
        columns: { credits: true, id: true },
        where: eq(usage.userId, user.id),
    })
    return userUsage?.credits ?? initialCredits
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
        const { userId } = auth()
        if (!userId) return { error: "Unauthenticated" }
        await db.insert(usage).values({ userId }).onConflictDoNothing()

        const userUsage = await db.query.usage.findFirst({
            columns: { credits: true, id: true },
            where: eq(usage.userId, userId),
        })

        const creditsUsage = data.types.reduce(
            (acc, curr) => acc + (curr.numberOfMocks === "25" ? 1 : 2),
            0
        )
        if (!userUsage) return { error: "Error fetching user info" }

        if (creditsUsage > userUsage.credits)
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
            .set({ credits: userUsage.credits - creditsUsage })
            .where(eq(usage.id, userUsage.id))
        return { result: object.results }
    } catch (e) {
        return { error: "Internal error" }
    }
}
