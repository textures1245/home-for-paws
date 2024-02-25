import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { ChatRoom as PrismaChatRoom } from "@prisma/client";
import {
  ChatMessageParamsRequest,
  createRoomChat,
  getChatRoomByUserUuid,
} from "../controller/chatMessageController";

type ChatState = {
  roomChatList: PrismaChatRoom[];
};

type ChatActionState = {
  setUserChatRoomList: (userUuid: string) => void;
  createRequestChatRoom: (
    chatRoom: ChatMessageParamsRequest
  ) => Promise<PrismaChatRoom["uuid"]>;
  getChatRoomList: () => PrismaChatRoom[];
};

const chatMsgStore = create<ChatState & ChatActionState>()(
  devtools(
    persist(
      (set, get) => ({
        roomChatList: [],
        setUserChatRoomList: async (userUuid: string) => {
          const chatRoomList = (await getChatRoomByUserUuid(userUuid)) ?? [];
          set((state) => ({ roomChatList: chatRoomList }));
        },
        createRequestChatRoom: async (chatRoom: ChatMessageParamsRequest) => {
          const roomChat = await createRoomChat(chatRoom);
          set((s) => ({
            roomChatList: [...s.roomChatList, roomChat],
          }));
          return roomChat.uuid;
        },
        getChatRoomList: () => get().roomChatList,
      }),

      { name: "chat-message-storage" }
    )
  )
);

export default chatMsgStore;
