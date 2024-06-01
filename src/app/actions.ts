"use server"

import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"
import { formSchema } from "./mock-data-form"

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
}) {
    const prompt = `You will receive an array of typescript types or interfaces and optionally a description and 
        will generate mock data based on those types and a specified number for the length of the result. The output should format be an array of object with keys resultName(the name o the type) and json (the stringified formatted json data).
        The output should look contain real-world-like data.
        Input example: {"name":"User","typeDefinition":"interface User {\\n  id: number\\n  name: string\\n  age: number\\n}","maxNumberOfMocks":"2"}.
        Output example: {"results": [{"resultName": "User", "json": "[{id: 1, name: 'John', age: 25}, {id: 2, name: 'Jane', age: 30}]"}].
        
        Input: ${JSON.stringify(data.types)} 
        ${`Description: ${data.description || "no description"}`}`

    const { usage, object } = await generateObject({
        model: openai("gpt-3.5-turbo"),
        schema: outputSchema,
        prompt,
    })
    return object.results
}
