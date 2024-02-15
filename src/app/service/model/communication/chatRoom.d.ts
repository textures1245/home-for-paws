import { z } from "zod";
import { messageModel } from "./message";

export const roomChatModel = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userUuid: z.string().uuid().array(),
  messages: messageModel.array(),
});

export type RoomChat = z.infer<typeof roomChatModel>;
