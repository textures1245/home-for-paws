import prisma from "@/app/service/database/prisma/prisma.config";
import { User } from "@/app/service/model/user/user";
import { Auth } from "@/app/service/model/user/auth";
import { createPreference } from "./preferenceController";
import { Prisma } from "@prisma/client";

export async function ifUserExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user !== null;
}

export async function createUser(userData: User, authCredential: Auth) {
  if (!userData && !authCredential)
    throw new Error("Invalid user data or auth credential");

  try {
    const preference = await createPreference(userData);

    const user = await prisma.user.create({
      data: {
        authUuid: authCredential.uuid,
        userPreferenceUuid: preference.uuid,
        email: userData.email,
        userRole: userData.userRole,
      },
    });

    return user;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(
        JSON.stringify({
          code: e.code,
          meta: e.meta,
          message: e.message,
        })
      );
    }
    throw e;
  }
}
