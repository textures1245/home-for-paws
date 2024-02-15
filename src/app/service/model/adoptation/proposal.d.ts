import { z } from "zod";

export const proposalModel = z.object({
  id: z.number().int().positive(),
  uid: z.string().uuid(),
  petUuid: z.string().uuid(),
  ownerUuid: z.string().uuid(),
  offeringPrice: z.number(),
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Proposal = z.infer<typeof proposalModel>;