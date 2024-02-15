import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Proposal } from "@/app/service/model/adoptation/proposal";

const paymentStore = create<Proposal>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uid: "",
        petUuid: "",
        ownerUuid: "",
        offeringPrice: 0,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      { name: "proposal-storage" }
    )
  )
);

export default paymentStore;
