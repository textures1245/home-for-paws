import { petModel } from "../../model/pet/pet";
import { z } from "zod";
import { schemaValidate } from "../../error/zodValidation";
import prismaHandle from "../../error/prismaHandle";
import prisma from "../../database/prisma/prisma.config";

const petParamsModel = petModel.pick({
  type: true,
  age: true,
  species: true,
  ownerUuid: true,
  name: true,
});

export type PetParamsRequest = z.infer<typeof petParamsModel>;

export async function createPet(reqData: PetParamsRequest) {
  const validateReq = schemaValidate(petParamsModel)(reqData);

  try {
    return prisma.pet.create({
      data: {
        petOwnerUuid: validateReq.ownerUuid,
        type: validateReq.type,
        age: validateReq.age,
        species: validateReq.species,
        name: validateReq.name, // Add the missing 'name' property
      },
    });
    // create pet
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function getUserPet(ownerUuid: string) {
  try {
    return prisma.pet.findMany({
      where: {
        petOwnerUuid: ownerUuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}
