import { z } from "zod";

export const messageModel = z.object({
  id: z.number().int().positive(),
  uid: z.string().uuid(),
  userUuid: z.string().uuid(),
  chatRoomUuid: z.string().uuid(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Message = z.infer<typeof messageModel>;
