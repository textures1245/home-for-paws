

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Payment as PrismaPayment } from "@prisma/client";
import { getPayments } from "../controller/paymentController";

type PaymentState = {
  paymentList: PrismaPayment[];
  setPaymentList: () => void;
  addPayment: (payment: PrismaPayment) => void;
};

const paymentStore = create<PaymentState>()(
  devtools(
    persist(
      (set, get) => ({
        paymentList: [],
        setPaymentList: async () => {
          const paymentList = await getPayments();
          set((state) => ({ paymentList: paymentList }));
        },
        addPayment: async (payment: PrismaPayment) => {
          set((s) => ({
            paymentList: [...s.paymentList, payment],
          }));
        },
      }),
      { name: "payment" }
    )
  )
);

export default paymentStore;
