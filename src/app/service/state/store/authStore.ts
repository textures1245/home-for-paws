import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Auth } from "@/app/service/model/user/auth";

type AuthState = Auth & {
  setAuth: (authData: Auth) => void;
};



const paymentStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uuid: "",
        email: "",
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        setAuth: (authData: Auth) => set((state) => ({ ...authData })),
      }),

      { name: "auth-storage" }
    )
  )
);

export default paymentStore;
