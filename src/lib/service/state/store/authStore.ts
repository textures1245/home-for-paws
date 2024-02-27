import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Auth as PrismaAuth } from "@prisma/client";
import {
  AuthCredential,
  createAuthCredential,
  validateCredential,
} from "../controller/authController";

type AuthState = {
  auth: PrismaAuth | null;
};

type AuthActionState = {
  setAuth: (authData: PrismaAuth) => void;
  createAuth: (authData: AuthCredential) => Promise<PrismaAuth>;
  getAuth: () => PrismaAuth | null;
};

const authStore = create<AuthState & AuthActionState>()(
  devtools(
    persist(
      (set, get) => ({
        auth: null,
        createAuth: async (authData: AuthCredential) => {
          const auth = await createAuthCredential(authData);
          get().setAuth(auth);
          return auth;
        },
        setAuth: (auth: PrismaAuth) => {
          set((s) => ({ auth }));
        },
        getAuth: () => get().auth,
      }),

      { name: "auth-storage" }
    )
  )
);

export default authStore;
