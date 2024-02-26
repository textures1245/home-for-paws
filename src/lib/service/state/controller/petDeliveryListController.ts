import { z } from "zod";
import prisma from "../../database/prisma/prisma.config";
import prismaHandle from "../../error/prismaHandle";

const petDeliveryListParamsModel = z.object({
  petUuid: z.string().uuid(),
  ownerUuid: z.string().uuid(),
  status: z.string(),
  maxPrice: z.number(),
  minPrice: z.number(),
  address: z.string(),
  willingnessToTravel: z.boolean(),
});

export type PetDeliveryListParams = z.infer<typeof petDeliveryListParamsModel>;

export async function createPetDeliveryList(dataReq: PetDeliveryListParams) {
  const validateReq = petDeliveryListParamsModel.parse(dataReq);
  try {
    return prisma.petDeliveryList.create({
      data: {
        ...validateReq,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function getPetDeliveryList() {
  try {
    return prisma.petDeliveryList.findMany();
  } catch (e) {
    throw prismaHandle(e);
  }
}
