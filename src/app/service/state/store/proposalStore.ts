"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import {
  ProposalParam,
  createProposalRequest,
  getProposals,
  setProposalStatusThenDoTransaction,
  updateProposal,
} from "../controller/proposalController";

import {
  Proposal as PrismaProposal,
  Payment as PrismaPayment,
} from "@prisma/client";
import paymentStore from "./paymentStore";
import { ToastData } from "../../utils/toast.config";

type ProposalState = {
  proposalList: PrismaProposal[];
  setProposalList: () => void;
  addProposal: (request: ProposalParam) => void;
  updateStatus: (
    status: PrismaProposal["status"],
    proposalData: ProposalParam,
    transactionType: string
  ) => Promise<{
    toastData: ToastData;
    payment?: PrismaPayment;
  }>;
  getProposalList: () => PrismaProposal[];
};

const proposalStore = create<ProposalState>()(
  devtools(
    persist(
      (set, get) => ({
        proposalList: [],
        setProposalList: async () => {
          const proposalList = await getProposals();
          set((state) => ({ proposalList: proposalList }));
        },
        addProposal: async (request: ProposalParam) => {
          const proposal = await createProposalRequest(request);
          set((s) => ({
            proposalList: [...s.proposalList, proposal],
          }));
        },
        updateStatus: async (
          status: PrismaProposal["status"],
          proposalData: ProposalParam,
          transactionType: string
        ) => {
          const res = await setProposalStatusThenDoTransaction(
            status,
            proposalData,
            transactionType
          );
          if (res) {
            set((s) => {
              const convertToPrismaModelData = {
                uuid: proposalData.uid,
                petUuid: proposalData.petUuid,
                proposalOwnerUuid: proposalData.ownerUuid,
                offeringPrice: proposalData.offeringPrice,
                description: proposalData.description,
                offerAs: proposalData.offerAs,
                toOfferingUserUuid: proposalData.toUserUuid ?? null,
              };

              let proposal = s.proposalList.find(
                (s) => s.uuid === proposalData.uid
              );

              if (!proposal) {
                throw new Error("Proposal not found on client state");
              }

              if (res.toastData.type === "success") {
                paymentStore().addPayment(res.payment!);
              }

              proposal = {
                ...proposal,
                ...convertToPrismaModelData,
                status: status,
              };
              return { proposalList: s.proposalList };
            });
          }
          return res;
        },
        getProposalList: () => {
          return get().proposalList;
        },
      }),
      { name: "proposal-storage" }
    )
  )
);

export default proposalStore;
