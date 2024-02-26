import prisma from "../../database/prisma/prisma.config";
import prismaHandle from "../../error/prismaHandle";
import { z } from "zod";
import { schemaValidate } from "../../error/zodValidation";
const petAdopterListParamsModel = z.object({
  petUuid: z.string().uuid(),
  ownerUuid: z.string().uuid(),
  status: z.string(),
  maxPrice: z.number(),
  minPrice: z.number(),
  address: z.string(),
  willingnessToTravel: z.boolean(),
});

export type PetAdopterListParams = z.infer<typeof petAdopterListParamsModel>;

export async function createPetAdopterList(dataReq: PetAdopterListParams) {
  const validateReq = schemaValidate(petAdopterListParamsModel)(dataReq);

  try {
    return prisma.adopterList.create({
      data: {
        ...validateReq,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function getPetAdopterList() {
  try {
    return prisma.adopterList.findMany();
  } catch (e) {
    throw prismaHandle(e);
  }
}
