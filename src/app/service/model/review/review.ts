import { z } from "zod";

export const reviewModel = z.object({
  id: z.string(),
  uid: z.string(),
  reviewDetail: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rating: z.number().max(5).min(0),
});

export type Review = z.infer<typeof reviewModel>;
