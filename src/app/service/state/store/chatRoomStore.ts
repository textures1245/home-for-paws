import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { ChatRoom } from "@/app/service/model/communication/chatRoom";

const paymentStore = create<ChatRoom>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uuid: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        userUuid: [],
        messages: [],
      }),
      { name: "chat-room-storage" }
    )
  )
);

export default paymentStore;
