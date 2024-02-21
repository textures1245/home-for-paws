import { z } from "zod";

export const proposalModel = z.object({
  id: z.number().int().positive(),
  uid: z.string().uuid(),
  petUuid: z.string().uuid(),
  ownerUuid: z.string().uuid(),
  offeringPrice: z.number(),
  toUserUuid: z.string().uuid().optional(),
  description: z.string(),
  offerAs: z.enum(["USER_SENDER", "USER_ADOPTER", "ADMIN"]),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Proposal = z.infer<typeof proposalModel>;
