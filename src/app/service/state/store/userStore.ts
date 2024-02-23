import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import authStore from "@/app/service/state/store/authStore";
import userPreferenceStore from "@/app/service/state/store/preferenceStore";
import { User as PrismaUser, Auth as PrismaAuth } from "@prisma/client";
import {
  UserParamsRequest,
  createUser,
  getUser,
} from "../controller/userController";
import { PreferenceParams } from "../controller/preferenceController";

type UserState = {
  user: PrismaUser | null;
};

type UserActionState = {
  createUser: (
    userDataReq: UserParamsRequest,
    userPrefReq: PreferenceParams,
    authCredential: PrismaAuth
  ) => Promise<PrismaUser>;
  setUser: (authUuid: string) => void;
  getUser: () => PrismaUser | null;
};

const paymentStore = create<UserState & UserActionState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        createUser: async (
          userDataReq: UserParamsRequest,
          userPrefReq: PreferenceParams,
          authCredential: PrismaAuth
        ) => {
          const user = await createUser(
            userDataReq,
            userPrefReq,
            authCredential
          );

          return user;
        },
        setUser: async (authUuid: string) => {
          const user = await getUser(authUuid);
          if (!user) throw new Error("User not found");

          set((state) => ({ user: user }));
        },
        getUser: () => get().user,
      }),
      { name: "user-storage" }
    )
  )
);

export default paymentStore;
