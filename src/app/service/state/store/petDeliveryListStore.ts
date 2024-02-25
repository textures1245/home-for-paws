import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { PetDeliveryList as PrismaPetDelivery } from "@prisma/client";
import {
  PetDeliveryListParams,
  createPetDeliveryList,
  getPetDeliveryList,
} from "../controller/petDeliveryListController";

type PetDeliveryState = {
  petDeliveryList: PrismaPetDelivery[];
};

type PetDeliveryAction = {
  setPetDeliveryList: () => void;
  getPetDeliveryList: () => PrismaPetDelivery[];
  getUserPetDeliveryList: (ownerUuid: string) => PrismaPetDelivery[];
  addNewPetDelivery: (petDelivery: PetDeliveryListParams) => void;
};

const petDeliveryStore = create<PetDeliveryState & PetDeliveryAction>()(
  devtools(
    persist(
      (set, get) => ({
        petDeliveryList: [],
        setPetDeliveryList: async () => {
          const petDeliveryList = await getPetDeliveryList();
          set((state) => ({ petDeliveryList: petDeliveryList }));
        },
        getPetDeliveryList: () => get().petDeliveryList,
        getUserPetDeliveryList: (ownerUuid: string) => {
          const userPetDeliveryList = get().petDeliveryList.filter(
            (petDelivery) => petDelivery.ownerUuid === ownerUuid
          );
          return userPetDeliveryList;
        },
        addNewPetDelivery: async (petDelivery: PetDeliveryListParams) => {
          const newPetDelivery = await createPetDeliveryList(petDelivery);
          set((s) => ({
            petDeliveryList: [...s.petDeliveryList, newPetDelivery],
          }));
          return newPetDelivery;
        },
      }),
      { name: "pet-delivery-storage" }
    )
  )
);

export default petDeliveryStore;
