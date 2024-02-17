import type { Config } from "drizzle-kit";

export default {
  schema: "./schema.ts",
  out: "./drizzle-test",
  driver: "better-sqlite",
  dbCredentials: {
    url: "sqlite-test.db",
  },
  verbose: true,
  strict: true
} satisfies Config

const file = __filename
export {file }