import { initialCredits } from "@/constants"
import { InferInsertModel, relations, sql } from "drizzle-orm"
import {
    boolean,
    pgTable,
    real,
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
    json: text("json"),
    userId: text("userId")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    apiEnabled: boolean("apiEnabled").default(true),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
})

export const generationResults = pgTable("generationResult", {
    id: text("id")
        .default(sql`gen_random_uuid()`)
        .primaryKey(),
    json: text("json").notNull(),
    typeDefinition: text("typeDefinition").notNull(),
    name: text("typeName").notNull(),
    resultId: text("resultId")
        .references(() => results.id, { onDelete: "cascade" })
        .notNull(),
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

export const generationResultsRelations = relations(generationResults, ({ one }) => ({
    result: one(results, {
        fields: [generationResults.resultId],
        references: [results.id],
    }),
}))
export const resultsRelations = relations(results, ({ many }) => ({
    generationResults: many(generationResults),
    user: many(users),
}))
export const usersRelations = relations(users, ({ many }) => ({
    results: many(results),
    refreshTokens: many(refreshTokens),
}))