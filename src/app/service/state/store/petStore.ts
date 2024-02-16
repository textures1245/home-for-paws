import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Pet } from "@/app/service/model/pet/pet";

const paymentStore = create<Pet>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uuid: "",
        uid: "",
        name: "",
        type: "DOG",
        species: "",
        age: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      { name: "pet-storage" }
    )
  )
);

export default paymentStore;
