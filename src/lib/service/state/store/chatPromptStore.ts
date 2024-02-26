import { ChatSession } from "@google/generative-ai";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { generatePrompt, runChat } from "../../utils/gemini-ai-prompt.config";

type ChatPromptState = {
  messageList: {
    userMsgSender: string;
    BotMsgReceiverMsg: string;
    timestamp: Date;
  }[];
  chatSession: ChatSession | null;
};

type ChatPromptActionState = {
  createMessage: (contentSender: string) => void;
  getMessages: () => ChatPromptState["messageList"]; // Add the missing getMessages property
  setChatSession: (chatSession: ChatSession) => void;
  addMessage: (message: ChatPromptState["messageList"][0]) => void;
};

const chatPromptStore = create<ChatPromptState & ChatPromptActionState>()(
  devtools(
    persist(
      (set, get) => ({
        messageList: [],
        chatSession: null,
        createMessage: async (contentSender: string) => {
          if (get().chatSession === null) {
            const cs = await runChat();
            get().setChatSession(cs);
          } else {
            const contentReceiver = await generatePrompt(
              contentSender,
              get().chatSession!
            );
            const msg: ChatPromptState["messageList"][0] = {
              userMsgSender: contentSender,
              BotMsgReceiverMsg: contentReceiver,
              timestamp: new Date(),
            };
            get().addMessage(msg);
          }
        },
        setChatSession: (chatSession: ChatSession) => {
          set((state) => ({
            chatSession: chatSession,
          }));
        },
        addMessage: (msg: ChatPromptState["messageList"][0]) =>
          set((state) => ({
            messageList: [...state.messageList, msg],
          })),
        getMessages: () => get().messageList, // Add the missing getMessages property
      }),
      { name: "bot-chat-prompt-storage" }
    )
  )
);

export default chatPromptStore;
