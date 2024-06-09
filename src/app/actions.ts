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
            json: z.string(),
        })
    ),
})

export async function generateMockData(data: {
    types: {
        name: string
        typeDefinition: string
        maxNumberOfMocks: string
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

        const mockCreditsUsage = data.types.reduce(
            (acc, curr) => acc + (curr.maxNumberOfMocks === "25" ? 1 : 2),
            0
        )
        if (!userUsage) return { error: "Error fetching user info" }

        if (mockCreditsUsage > userUsage.credits)
            return { error: "You don't have enough credits" }

        const prompt = `You will receive an array of typescript types or interfaces, a number of mocks and optionally a description and 
            will generate mock data based on those types. The output should format be an array of object with keys resultName(the name o the type) and json (the stringified formatted json data).
            The output should look contain real world-like data.
            Input example: {"name":"User","typeDefinition":"interface User {\\n  id: number\\n  name: string\\n  age: number\\n}","maxNumberOfMocks":"2"}.
            Output example: {"results": [{"resultName": "User", "json": "[{id: 1, name: 'John', age: 25}, {id: 2, name: 'Jane', age: 30}]"}]
            
            Input: ${JSON.stringify(data.types)} 
            ${`Description: ${data.description || "no description"}`}`

        const { object } = await generateObject({
            model: openai("gpt-3.5-turbo"),
            schema: outputSchema,
            prompt,
        })
        await db
            .update(usage)
            .set({ credits: userUsage.credits - mockCreditsUsage })
            .where(eq(usage.id, userUsage.id))
        return { result: object.results }
    } catch {
        return { error: "Internal error" }
    }
}
