import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "@/app/service/model/user/user";
import authStore from "@/app/service/state/store/authStore";
import userPreferenceStore from "@/app/service/state/store/preferenceStore";

const paymentStore = create<User>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uid: "", // Add the missing property 'uid'
        email: "",
        password: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        userRole: "USER_SENDER",
        userPreferences: userPreferenceStore.getState(),
        auth: authStore.getState(),
      }),
      { name: "user-storage" }
    )
  )
);

export default paymentStore;
