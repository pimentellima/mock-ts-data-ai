import { pgTable, serial, text, integer, primaryKey } from "drizzle-orm/pg-core"
import { initialCredits } from "@/constants"

export const usage = pgTable("usage", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    credits: integer("credits").notNull().default(initialCredits),
})