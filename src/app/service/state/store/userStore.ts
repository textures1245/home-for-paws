import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User as PrismaUser, Auth as PrismaAuth } from "@prisma/client";
import {
  UserParamsRequest,
  createUser,
  getUser,
} from "../controller/userController";
import { PreferenceParams } from "../controller/preferenceController";
import preferenceStore from "@/app/service/state/store/preferenceStore";

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
          const { createPreference, setPreference } = preferenceStore();

          await createPreference(userPrefReq).then((res) => setPreference(res));

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
