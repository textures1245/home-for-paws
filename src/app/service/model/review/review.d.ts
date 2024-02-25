import { z } from "zod";

export const reviewModel = z.object({
  id: z.number().positive(),
  uid: z.string().uuid(),
  ownerUuid: z.string().uuid(),
  toUserUuid: z.string().uuid(),
  reviewDetail: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rating: z.number().max(5).min(0),
});

export type Review = z.infer<typeof reviewModel>;
