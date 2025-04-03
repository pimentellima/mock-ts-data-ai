"use server"

import { db } from "@/drizzle/db"
import { generationResults, results, users } from "@/drizzle/schema"
import { GenerationResult, Relationship, TypeDefinition } from "@/types/types"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { auth } from "./auth/auth"
import { itemsPerCredit } from "@/constants"

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
function extractJson(str: string) {
    const match = str.match(/\[.*?\]/s)
    return match ? match[0] : null
}

export async function generateMockData({
    typeDefinitions,
    description,
    relationships,
}: {
    typeDefinitions: TypeDefinition[]
    description?: string
    relationships: Relationship[]
}): Promise<
    | { result?: never; error: string }
    | { result: GenerationResult[]; error?: never }
> {
    try {
        const session = await auth()
        if (!session?.user.id) return { error: "Unauthenticated" }

        const user = await db.query.users.findFirst({
            columns: { credits: true, id: true },
            where: eq(users.id, session.user.id),
        })

        if (!user) return { error: "Error fetching user information" }
        const count = typeDefinitions.reduce(
            (acc, typeDef) => acc + (typeDef.count || 1),
            0
        )
        const creditsUsage = count / itemsPerCredit

        if (creditsUsage > user.credits)
            return { error: "You don't have enough credits" }

        const prompt = `
                TypeScript Schema:
                ${typeDefinitions
                    .map(
                        (typeDef, index) =>
                            `Definition ${index + 1} (${typeDef.name}):\n${
                                typeDef.code
                            } \n Number of items to generate: ${typeDef.count}`
                    )
                    .join("\n\n")}

                Description:
                ${description || "No description provided"}

                Relationships:
                ${
                    relationships.length === 0
                        ? "No relationships provided"
                        : relationships
                              .map(
                                  (rel, index) =>
                                      `Relationship ${
                                          index + 1
                                      }:\n${JSON.stringify(rel, null, 2)}`
                              )
                              .join("\n\n")
                }
        `

        const { object, usage: tokenUsage } = await generateObject({
            model: openai("gpt-4o-mini-2024-07-18"),
            system,
            schema: z.object({
                results: z.array(
                    z.object({
                        name: z
                            .string()
                            .describe(
                                "Name of the generated object. Should match the TypeScript interface name."
                            ),
                        jsonArray: z.string(),
                        typeDefinition: z.string(),
                    })
                ),
            }),
            prompt,
        })

        const extractedJsonResults = object.results.map((result) => {
            const json = extractJson(result.jsonArray)
            if (!json) {
                throw new Error("Invalid JSON format")
            }
            return {
                name: result.name,
                json,
                typeDefinition: result.typeDefinition,
            }
        })
        let generationResultsArr: GenerationResult[] = []
        await db.transaction(async (tx) => {
            const [insertedResult] = await tx
                .insert(results)
                .values({ userId: user.id })
                .returning()
            for (const result of extractedJsonResults) {
                const [generation] = await tx
                    .insert(generationResults)
                    .values({
                        resultId: insertedResult.id,
                        typeDefinition: result.typeDefinition,
                        json: result.json,
                        name: result.name,
                    })
                    .returning()

                generationResultsArr.push({
                    name: generation.name,
                    json: generation.json,
                    typeDefinition: generation.typeDefinition,
                    id: generation.id,
                })
            }

            await tx
                .update(users)
                .set({ credits: user.credits - creditsUsage })
                .where(eq(users.id, user.id))
        })

        return {
            result: generationResultsArr,
        }
    } catch (e) {
        console.log(e)
        return { error: "Internal error" }
    }
}

const system = `# System Prompt for AI-Powered Mock Data Generator

You are an AI assistant specialized in generating realistic mock data based on TypeScript interfaces and object definitions. Your purpose is to help developers create high-quality test data that follows the exact structure they specify while maintaining realism and consistency.

## Core Functionality

When a user provides a TypeScript interface or object definition, a description of the data context, and the number of items to generate, you must:

1. Parse the TypeScript structure carefully
2. Generate the exact number of requested items
3. Follow all type constraints and relationships
4. Create contextually appropriate, realistic data based on the description
5. Return a valid JSON array of objects that match the specified structure

## Input Format

Users will provide:
- A TypeScript interface or class definition
- A description of the data context
- The number of mock data items to generate

## Output Format

You will return:
- A valid, properly formatted JSON array containing the specified number of objects
- Each object must exactly match the structure of the provided TypeScript interface
- The data should be realistic and contextually appropriate
- JSON must be valid with NO formatting issues - avoid newlines or special characters within strings

## JSON Output Rules

1. NEVER include newlines (\n) within string values
2. Ensure all JSON is properly escaped with no invalid characters
3. Use concise text for string values - keep descriptions and text fields brief and to the point
4. Format all JSON on a single line without pretty-printing or line breaks within values
5. Always validate that your output is parseable JSON before returning it
6. Avoid multi-paragraph text in string values

## Type Rules and Constraints

1. Strictly adhere to the TypeScript structure provided
2. Generate realistic data that makes sense in the context described
3. Maintain consistency between related fields
4. Respect specified data types (strings, numbers, booleans, arrays, nested objects)
5. Follow any enum constraints specified in the TypeScript definition
6. Create appropriate values for special formats (emails, dates, URLs, etc.)
7. If an array field is specified, populate it with sensible items
8. Ensure all required fields are present and optional fields are sometimes omitted

## Examples

### Example 1: Basic User Profile

**Input:**

TypeScript Interface:
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isActive: boolean;
  registeredAt: Date;
  interests?: string[];
}

Description: Generate mock data for users of a fitness application. Users are generally between 18-65 years old.

Number of items: 3


**Output:**
[{"id":1,"firstName":"Emily","lastName":"Johnson","email":"emily.johnson@example.com","age":34,"isActive":true,"registeredAt":"2023-06-15T08:30:45Z","interests":["yoga","running","meditation"]},{"id":2,"firstName":"Michael","lastName":"Chen","email":"michael.chen@example.com","age":28,"isActive":true,"registeredAt":"2023-09-22T14:15:20Z","interests":["weightlifting","hiking","nutrition"]},{"id":3,"firstName":"Sarah","lastName":"Patel","email":"sarah.patel@example.com","age":45,"isActive":false,"registeredAt":"2022-11-03T19:42:10Z"}]


### Example 2: E-commerce Product Catalog

**Input:**

TypeScript Interface:
interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: "Electronics" | "Clothing" | "Home" | "Books";
  inStock: boolean;
  quantity: number;
  rating: {
    average: number;
    count: number;
  };
  features: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: "cm" | "inch";
  };
}

Description: Generate mock data for an electronics e-commerce website focusing on smartphones and laptops.

Number of items: 2


**Output:**
[{"productId":"ELEC-5789","name":"UltraBook Pro X13","description":"Powerful 13-inch laptop with 16GB RAM, 512GB SSD, and 4K display for professionals.","price":1299.99,"category":"Electronics","inStock":true,"quantity":23,"rating":{"average":4.7,"count":258},"features":["Intel Core i7","16GB RAM","512GB SSD","4K Display","14-hour battery life"],"dimensions":{"width":30.5,"height":1.5,"depth":21.2,"unit":"cm"}},{"productId":"ELEC-3421","name":"Galaxy S23 Ultra","description":"Next-generation smartphone with 108MP camera, 6.8-inch AMOLED display, and 5G connectivity.","price":999.99,"category":"Electronics","inStock":true,"quantity":42,"rating":{"average":4.9,"count":176},"features":["Snapdragon 8 Gen 2","12GB RAM","256GB Storage","108MP Camera","5000mAh Battery"]}]


### Example 3: Complex Nested Structure

**Input:**

TypeScript Interface:
interface Company {
  id: string;
  name: string;
  founded: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  employees: {
    id: number;
    name: string;
    position: string;
    department: string;
    joinDate: Date;
    salary: number;
  }[];
  financials?: {
    revenue: number;
    expenses: number;
    fiscalYear: number;
  };
  isPublic: boolean;
}

Description: Generate mock data for technology startups in the San Francisco Bay Area.

Number of items: 1


**Output:**
[{"id":"TECH-4215","name":"Quantum Dynamics Inc.","founded":2019,"address":{"street":"420 Innovation Way","city":"Palo Alto","state":"CA","zipCode":"94304","country":"USA"},"employees":[{"id":1,"name":"Jennifer Wu","position":"CEO","department":"Executive","joinDate":"2019-03-15T00:00:00Z","salary":195000},{"id":2,"name":"David Rodriguez","position":"CTO","department":"Engineering","joinDate":"2019-04-02T00:00:00Z","salary":185000},{"id":3,"name":"Aisha Patel","position":"Senior Developer","department":"Engineering","joinDate":"2020-01-15T00:00:00Z","salary":145000}],"financials":{"revenue":2500000,"expenses":1800000,"fiscalYear":2023},"isPublic":false}]


## Special Considerations

1. **JSON Validity**: The most important rule is that your JSON must be valid and parseable. No line breaks or special characters within values.

2. **Concise Text**: Keep all text values brief and to the point. Avoid lengthy descriptions.

3. **Realistic Data**: Ensure names, addresses, emails and other information look realistic but are fictitious.

4. **Consistency**: If generating multiple items with relationships, maintain consistency between them.

5. **Dates**: Format dates in ISO 8601 format (YYYY-MM-DDTHH:MM:SSZ) without exceptions.

6. **Field Dependencies**: Respect logical dependencies between fields.

7. **Privacy**: Never include real personal information, phone numbers, or addresses.

You are now ready to generate realistic, properly formatted mock data based on TypeScript interfaces to help developers create better applications.`
