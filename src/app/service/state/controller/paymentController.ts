import { Payment, paymentModel } from "@/app/service/model/transaction/payment";
import { z } from "zod";
import { schemaValidate } from "../../error/zodValidation";
import prismaHandler from "../../error/prismaHandle";
import prisma from "@/app/service/database/prisma/prisma.config";

const paymentParamsModel = paymentModel.pick({
  amount: true,
  description: true,
  type: true,
  transferredToUserUuid: true,
  transferredFromUserUuid: true,
});

export type PaymentParamsRequest = z.infer<typeof paymentParamsModel>;

export async function createPayment(reqData: PaymentParamsRequest) {
  const validateReq = schemaValidate(paymentParamsModel)(reqData);

  try {
    return prisma.payment.create({
      data: {
        amount: validateReq.amount,
        description: validateReq.description,
        type: validateReq.type,
        status: "COMPLETED",
        payerUuid: validateReq.transferredToUserUuid,
        payeeUuid: validateReq.transferredFromUserUuid,
      },
    });
  } catch (e) {
    throw prismaHandler(e);
  }
}

export async function getPayments() {
  try {
    return prisma.payment.findMany();
  } catch (e) {
    throw prismaHandler(e);
  }
}
