import prisma from "@/app/service/database/prisma/prisma.config";
import { PreferenceParams, createPreference } from "./preferenceController";
import { Auth as PrismAuth, User as PrismaUser } from "@prisma/client";
import prismaHandle from "@/app/service/error/prismaHandle";
import { userModel } from "@/app/service/model/user/user";
import { z } from "zod";

const userParamsModel = userModel.pick({
  email: true,
  userRole: true,
  name: true,
});

export type UserParamsRequest = z.infer<typeof userParamsModel>;

export async function ifUserExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user !== null;
}

export async function createUser(
  userDataReq: UserParamsRequest,
  userPreferenceReq: PreferenceParams,
  authCredential: PrismAuth
) {
  if (!userDataReq && !authCredential)
    throw new Error("Invalid user data or auth credential");

  try {
    const preference = await createPreference(userPreferenceReq);

    return prisma.user.create({
      data: {
        name: userDataReq.name,
        authUuid: authCredential.uuid,
        userPreferenceUuid: preference.uuid,
        email: userDataReq.email,
        userRole: userDataReq.userRole,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function getUser(authUuid: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        authUuid: authUuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}
