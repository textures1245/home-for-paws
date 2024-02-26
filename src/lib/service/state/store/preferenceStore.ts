import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Preference as PrismaPreference } from "@prisma/client";
import {
  updatePreference,
  PreferenceParams,
  createPreference,
} from "../controller/preferenceController";

type PreferenceState = {
  userPreference: PrismaPreference | null;
};

type PreferenceActionState = {
  updatePreference: (perfData: PreferenceParams, prefUuid: string) => void;
  createPreference: (perfData: PreferenceParams) => Promise<PrismaPreference>;
  setPreference: (pref: PrismaPreference) => void;
  getPreference: () => PrismaPreference | null;
};

const preferenceStore = create<PreferenceState & PreferenceActionState>()(
  devtools(
    persist(
      (set, get) => ({
        userPreference: null,
        updatePreference: async (
          perfData: PreferenceParams,
          prefUuid: string
        ) => {
          const pref = await updatePreference(perfData, prefUuid);
          set((s) => ({
            userPreference: pref,
          }));
        },
        setPreference: (pref: PrismaPreference) => {
          set((s) => ({
            userPreference: pref,
          }));
        },
        createPreference: async (perfData: PreferenceParams) => {
          return createPreference(perfData);
        },
        getPreference: () => get().userPreference,
      }),
      { name: "pet-storage" }
    )
  )
);

export default preferenceStore;
