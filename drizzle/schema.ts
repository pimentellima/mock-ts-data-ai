import { initialCredits } from "@/constants"
import { InferInsertModel, sql } from "drizzle-orm"
import {
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core"

export const users = pgTable(
    "users",
    {
        id: text("id").primaryKey(),
        name: text("name"),
        email: text("email").unique(),
        password: text("password"),
        credits: integer("credits").notNull().default(initialCredits),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex("unique_idx").on(users.email),
        }
    }
)

export const refreshTokens = pgTable(
    "refreshTokens",
    {
        token: text("token")
            .notNull()
            .default(sql`gen_random_uuid()`)
            .primaryKey(),
        userId: text("userId")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => {
        return {
            compoundKey: primaryKey({ columns: [table.token, table.userId] }),
        }
    }
)

export type NewUser = InferInsertModel<typeof users>
export type NewSession = InferInsertModel<typeof refreshTokens>
