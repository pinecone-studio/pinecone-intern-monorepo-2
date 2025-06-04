import { z } from "zod";

export const filterConcertSchema = z.object({
    title : z.string().optional(),
    artists : z.array(z.string()).optional(),
    day : z.coerce.date().optional()
})
export type filterConcertInput = z.infer<typeof filterConcertSchema>