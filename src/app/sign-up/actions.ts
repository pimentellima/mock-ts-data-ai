"use server"
import { db } from "@/drizzle/db"
import { signupFormSchema } from "./schema"
import { users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import * as z from "zod"

export async function signup(
    data: z.infer<typeof signupFormSchema>
): Promise<{ error?: string; success?: boolean }> {
    try {
        const validationResult = signupFormSchema.safeParse({
            email: data.email,
            password: data.password,
        })

        if (!validationResult.success) {
            return {
                error: "Form validation failed",
                success: false,
            }
        }

        const { email, password } = validationResult.data

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        })

        if (existingUser) {
            return {
                error: "Email already taken",
                success: false,
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const id = crypto.randomUUID()

        await db.insert(users).values({
            id,
            email,
            password: hashedPassword,
        })
        return {
            success: true,
        }
    } catch {
        return {
            error: "Internal error",
        }
    }
}
