import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Message } from "@/app/service/model/communication/message";

const paymentStore = create<Message>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uid: "", // Add the missing property 'uid'
        userUuid: "", // Add the missing property 'userUuid'
        chatRoomUuid: "", // Add the missing property 'chatRoomUuid'
        content: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      { name: "message-storage" }
    )
  )
);

export default paymentStore;
