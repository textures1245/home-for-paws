import { z } from "zod";
import { messageModel } from "./message";

export const chatRoomModel = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userUuid: z.string().uuid().array(),
  messages: messageModel.array(),
});

export type ChatRoom = z.infer<typeof chatRoomModel>;
