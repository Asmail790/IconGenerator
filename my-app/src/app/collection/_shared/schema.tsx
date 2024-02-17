import { z } from "zod";

export const querySchema = z.object({
    style:z.string().optional(),
    description:z.string().optional(),
    page:z.coerce.number().default(0),
    pageSize:z.coerce.number().default(10),
  })
  
type queryKey = keyof z.infer<typeof querySchema>
type queryValue = string
export type queryEntry = [queryKey,queryValue] 