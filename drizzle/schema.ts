import { initialCredits } from "@/constants"
import { InferInsertModel, sql } from "drizzle-orm"
import {
    pgTable,
    real,
    text,
    timestamp,
    uniqueIndex
} from "drizzle-orm/pg-core"

export const users = pgTable(
    "users",
    {
        id: text("id").primaryKey(),
        name: text("name"),
        email: text("email").unique(),
        password: text("password"),
        credits: real("credits").notNull().default(initialCredits),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex("unique_idx").on(users.email),
        }
    }
)

export const results = pgTable("results", {
    id: text("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    json: text("json").notNull(),
    userId: text("userId")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
})

export const refreshTokens = pgTable("refreshTokens", {
    token: text("token")
        .notNull()
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    userId: text("userId")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export type NewUser = InferInsertModel<typeof users>
export type NewSession = InferInsertModel<typeof refreshTokens>
