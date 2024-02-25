import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { AdopterList as PrismaPetAdopter } from "@prisma/client";
import {
  PetAdopterListParams,
  createPetAdopterList,
  getPetAdopterList,
} from "../controller/petAdopterListController";

type PetAdopterState = {
  petAdopterList: PrismaPetAdopter[];
};

type PetAdopterAction = {
  setPetDeliveryList: () => void;
  getPetDeliveryList: () => PrismaPetAdopter[];
  getUserPetDeliveryList: (ownerUuid: string) => PrismaPetAdopter[];
  addNewPetDelivery: (petDelivery: PetAdopterListParams) => void;
};

const petAdopterStore = create<PetAdopterState & PetAdopterAction>()(
  devtools(
    persist(
      (set, get) => ({
        petAdopterList: [],
        setPetDeliveryList: async () => {
          const petAdopterList = await getPetAdopterList();
          set((state) => ({ petAdopterList: petAdopterList }));
        },
        getPetDeliveryList: () => get().petAdopterList,
        getUserPetDeliveryList: (ownerUuid: string) => {
          const userPetAdopterList = get().petAdopterList.filter(
            (petDelivery) => petDelivery.ownerUuid === ownerUuid
          );
          return userPetAdopterList;
        },
        addNewPetDelivery: async (petDelivery: PetAdopterListParams) => {
          const newPetDelivery = await createPetAdopterList(petDelivery);
          set((s) => ({
            petAdopterList: [...s.petAdopterList, newPetDelivery],
          }));
          return newPetDelivery;
        },
      }),
      { name: "pet-adopter-storage" }
    )
  )
);

export default petAdopterStore;
