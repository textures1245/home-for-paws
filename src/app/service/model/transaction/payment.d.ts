import { z } from "zod";

export const paymentModel = z.object({
  id: z.number().positive(),
  uuid: z.string().uuid(),
  transferredToUserUuid: z.string().uuid(),
  transferredFromUserUuid: z.string().uuid(),
  amount: z.number(),
  description: z.string(),
  status: z.enum(["COMPLETED", "FAILED"]),
  date: z.date(),
  type: z.string(),
});

export type Payment = z.infer<typeof paymentModel>;
