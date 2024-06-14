import * as z from "zod"

export const signInFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }),
    password: z
        .string()
        .min(1, { message: "Password field must not be empty." }),
})