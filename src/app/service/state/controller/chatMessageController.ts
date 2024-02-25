import { ChatRoom, chatRoomModel } from "../../model/communication/chatRoom";
import prismaHandle from "../../error/prismaHandle";
import prisma from "../../database/prisma/prisma.config";
import { z } from "zod";
import { schemaValidate } from "../../error/zodValidation";

const chatRoomParamModel = chatRoomModel.pick({
  petAdopterListReferUuid: true,
  petDeliveryListReferUuid: true,
  requestUserUuid: true,
  hostUserUuid: true,
});

export type ChatMessageParamsRequest = z.infer<typeof chatRoomParamModel>;

export async function createRoomChat(reqData: ChatMessageParamsRequest) {
  try {
    const validatedReq = schemaValidate(chatRoomParamModel)(reqData);

    return prisma.chatRoom.create({
      data: {
        adopterListUuid: validatedReq.petAdopterListReferUuid,
        petDeliveryListUuid: validatedReq.petDeliveryListReferUuid,
        requestUserUuid: validatedReq.requestUserUuid,
        hostUserUuid: validatedReq.hostUserUuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function sendMessageToChatRoom(
  roomChatUuid: string,
  content: string,
  userUuid: string
) {
  try {
    return prisma.message.create({
      data: {
        content,
        roomChatUuid,
        userUuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function getChatRoomByUserUuid(userUuid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (user) {
      return prisma.chatRoom.findMany({
        where: {
          OR: [
            {
              requestUserUuid: userUuid,
            },
            {
              hostUserUuid: userUuid,
            },
          ],
        },
      });
    }
  } catch (e) {
    throw prismaHandle(e);
  }
}
