import {
    pgTable,
    serial,
    text,
    integer,
} from "drizzle-orm/pg-core"

export const usage = pgTable("usage", {
    id: serial("id").primaryKey(),
    userId: text("user_id").unique(),
    credits: integer("credits").notNull().default(0),
})