import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Payment } from "@/app/service/model/transaction/payment";

const paymentStore = create<Payment>()(
  devtools(
    persist(
      (set, get) => ({
        id: 0,
        uuid: "",
        transferredToUserUuid: "",
        transferredFromUserUuid: "",
        amount: 0,
        description: "",
        status: "COMPLETED",
        date: new Date(),
        type: "",
      }),
      { name: "payment" }
    )
  )
);

export default paymentStore;
