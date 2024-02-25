import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Pet } from "@/app/service/model/pet/pet";
import { Pet as PrismaPet } from "@prisma/client";
import {
  PetParamsRequest,
  createPet,
  getUserPet,
} from "../controller/petController";

type PetState = {
  userPetList: PrismaPet[];
};

type PetActionState = {
  setUserPetList: (ownerUuid: string) => void;
  addPet: (reqData: PetParamsRequest) => void;
  getPet: () => PrismaPet[];
};

const paymentStore = create<PetState & PetActionState>()(
  devtools(
    persist(
      (set, get) => ({
        userPetList: [],
        setUserPetList: async (ownerUuid: string) => {
          const petList = await getUserPet(ownerUuid);
          set((state) => ({ userPetList: petList }));
        },
        addPet: async (reqData: PetParamsRequest) => {
          const pet = await createPet(reqData);
          set((s) => ({
            userPetList: [...s.userPetList, pet],
          }));
        },
        getPet: () => get().userPetList,
      }),
      { name: "pet-storage" }
    )
  )
);

export default paymentStore;
