import { integer, sqliteTable, text, primaryKey,blob } from "drizzle-orm/sqlite-core"
import type { AdapterAccount } from "@auth/core/adapters"
import Database from 'better-sqlite3';
import { drizzle } from "drizzle-orm/better-sqlite3";
import { randomUUID } from "node:crypto";
import { userTokensGranted } from "@/global.config/userTokensGranted";
 




const sqliteDb = new Database('sqlite.db');
export const db = drizzle(sqliteDb) 
 
export const users = sqliteTable("user", {
 id: text("id").notNull().primaryKey(),
 name: text("name"),
 email: text("email").notNull(),
 emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
 image: text("image"),
})

export const accounts = sqliteTable(
 "account",
 {
   userId: text("userId")
     .notNull()
     .references(() => users.id, { onDelete: "cascade" }),
   type: text("type").$type<AdapterAccount["type"]>().notNull(),
   provider: text("provider").notNull(),
   providerAccountId: text("providerAccountId").notNull(),
   refresh_token: text("refresh_token"),
   access_token: text("access_token"),
   expires_at: integer("expires_at"),
   token_type: text("token_type"),
   scope: text("scope"),
   id_token: text("id_token"),
   session_state: text("session_state"),
 },
 (account) => ({
   compoundKey: primaryKey({
       columns: [account.provider, account.providerAccountId],
     }),
 })
)

export const sessions = sqliteTable("session", {
sessionToken: text("sessionToken").notNull().primaryKey(),
userId: text("userId")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable(
"verificationToken",
{
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
},
(vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
})
)



type IconProperty = {color:string,style:string,description:string}
export const icons = sqliteTable("icons", {
  owner: text("owner").notNull().references( () => users.id,{onDelete:"cascade"}),
  data:blob("data",{mode:"buffer"}).notNull(),
  color:text("color").notNull(),
  style:text("style").notNull(),
  description:text("description").notNull(),
  id: text("id").primaryKey().$defaultFn(randomUUID),
})

export const imageTokens = sqliteTable("imageTokens",{
  owner: text("owner").notNull().references( () => users.id,{onDelete:"cascade"}),
  tokens:integer("tokens").default(userTokensGranted).notNull() 
}) 


export const totalCost = sqliteTable("totalCost",{
  id:integer("id").primaryKey(),
  cost:integer("cost").default(0).notNull()
})

