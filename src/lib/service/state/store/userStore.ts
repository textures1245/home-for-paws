import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
  User as PrismaUser,
  Auth as PrismaAuth,
  Review as PrismaReview,
} from "@prisma/client";
import {
  UserParamsRequest,
  createUser,
  getUser,
} from "../controller/userController";
import { PreferenceParams } from "../controller/preferenceController";
import preferenceStore from "@/lib/service/state/store/preferenceStore";
import { ReviewParam, createReview } from "../controller/reviewController";

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
  getUserByUuid: (authUuid: string) => Promise<PrismaUser>;
  onCreateReview: (reviewData: ReviewParam) => Promise<PrismaReview>;
};

const userStore = create<UserState & UserActionState>()(
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
        getUserByUuid: async (authUuid: string) => {
          const user = await getUser(authUuid);
          if (!user) throw new Error("User not found");
          return user;
        },
        onCreateReview: (dataReq: ReviewParam) => {
          return createReview(dataReq);
        },
      }),
      { name: "user-storage" }
    )
  )
);

export default userStore;
