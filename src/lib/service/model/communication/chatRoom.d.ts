import { z } from "zod";
import { messageModel } from "./message";

export const chatRoomModel = z.object({
  id: z.number().int().positive(),
  uuid: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  requestUserUuid: z.string().uuid(),
  hostUserUuid: z.string().uuid(),
  messages: messageModel.array(),
  petAdopterListReferUuid: z.string().uuid().optional(),
  petDeliveryListReferUuid: z.string().uuid().optional(),
});

export type ChatRoom = z.infer<typeof chatRoomModel>;
