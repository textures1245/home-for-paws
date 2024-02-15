import { z } from "zod";

export const petModel = z.object({
  id: z.number().positive(),
  uid: z.string().uuid(),
  name: z.string(),
  type: z.enum(["DOG", "CAT"]),
  species: z.string(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Pet = z.infer<typeof petModel>;
