import { z } from "zod";

export const authModel = z.object({
  id: z.number().positive(),
  uuid: z.string().uuid(),
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .min(6)
    .max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Auth = z.infer<typeof authModel>;
