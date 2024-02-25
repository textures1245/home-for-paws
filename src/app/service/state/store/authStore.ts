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
  setAuth: (authData: AuthCredential) => void;
  createAuth: (authData: AuthCredential) => Promise<PrismaAuth>;
  getAuth: () => PrismaAuth | null;
};

const paymentStore = create<AuthState & AuthActionState>()(
  devtools(
    persist(
      (set, get) => ({
        auth: null,
        createAuth: async (authData: AuthCredential) => {
          const auth = await createAuthCredential(authData);
          get().setAuth(auth);
          return auth;
        },
        setAuth: async (authData: AuthCredential) => {
          const validatedAuth = await validateCredential(authData);
          set((s) => ({ auth: validatedAuth }));
        },
        getAuth: () => get().auth,
      }),

      { name: "auth-storage" }
    )
  )
);

export default paymentStore;
