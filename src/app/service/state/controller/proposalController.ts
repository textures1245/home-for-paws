import {
  Proposal,
  proposalModel,
} from "@/app/service/model/adoptation/proposal";
import { z } from "zod";
import prisma from "@/app/service/database/prisma/prisma.config";
import onPrismaHandler from "../../error/prismaHandle";
import { createPayment } from "./paymentController";
import { ToastData } from "../../utils/toast.config";
import {
  Proposal as PrismaProposal,
  Payment as PrismaPayment,
} from "@prisma/client";
import { schemaValidate } from "../../error/zodValidation";

const proposalParamModel = proposalModel.pick({
  uid: true,
  ownerUuid: true,
  offeringPrice: true,
  petUuid: true,
  toUserUuid: true,
  description: true,
  offerAs: true,
});
export type ProposalParam = z.infer<typeof proposalParamModel>;

export async function getProposals() {
  try {
    return prisma.proposal.findMany();
  } catch (e) {
    throw onPrismaHandler(e);
  }
}

export async function createProposalRequest(request: ProposalParam) {
  try {
    return prisma.proposal.create({
      data: {
        proposalOwnerUuid: request.ownerUuid,
        offeringPrice: request.offeringPrice,
        petUuid: request.petUuid,
        toOfferingUserUuid: request.toUserUuid,
        status: "PENDING",
        description: request.description,
        offerAs: request.offerAs,
      },
    });
  } catch (e) {
    throw onPrismaHandler(e);
  }
}

export async function setProposalStatusThenDoTransaction(
  status: Proposal["status"],
  proposalData: ProposalParam,
  transactionType: string
): Promise<{
  toastData: ToastData;
  payment?: PrismaPayment;
}> {
  const validateReq = schemaValidate(proposalParamModel)(proposalData);

  await updateProposal(proposalData.uid, {
    status,
    toOfferingUserUuid: validateReq.toUserUuid,
  });

  return doTransactionDependState(status, validateReq, transactionType);
}

export async function doTransactionDependState(
  status: Proposal["status"],
  proposalData: ProposalParam,
  transactionType: string
): Promise<{
  toastData: ToastData;
  payment?: PrismaPayment;
}> {
  if (!proposalData.toUserUuid) {
    throw new Error("To user uuid is required");
  }

  const paymentDetail = {
    amount: proposalData.offeringPrice,
    description: proposalData.description,
    type: transactionType,
    transferredToUserUuid: proposalData.toUserUuid,
    transferredFromUserUuid: proposalData.ownerUuid,
  };

  if (status === "ACCEPTED") {
    const payment = await createPayment(paymentDetail);
    return {
      toastData: {
        message: "ข้อเสนอถูกยอมรับ",
        type: "success",
      },
      payment,
    };
  } else if (status === "REJECTED") {
    return {
      toastData: {
        message: "ข้อเสนอถูกยอมรับ",
        type: "success",
      },
    };
  }

  throw new Error("Invalid status");
}

export async function analyzeProposalStatus() {}

export async function getProposalByUuid(proposalUuid: string) {
  try {
    return await prisma.proposal.findUnique({
      where: {
        uuid: proposalUuid,
      },
    });
  } catch (e) {
    throw onPrismaHandler(e);
  }
}

export async function updateProposal(
  proposalUuid: string,
  partOfData: Partial<PrismaProposal>
) {
  try {
    return await prisma.proposal.update({
      where: {
        uuid: proposalUuid,
      },
      data: partOfData,
    });
  } catch (e) {
    throw onPrismaHandler(e);
  }
}
