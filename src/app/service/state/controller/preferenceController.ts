import prisma from "@/app/service/database/prisma/prisma.config";
import { User } from "@/app/service/model/user/user";
import { Prisma } from "@prisma/client";

export async function createPreference(userData: User) {
  try {
    const location = await prisma.location.create({
      data: {
        type: userData.userPreferences.dataAnalytics.location.type,
        properties: userData.userPreferences.dataAnalytics.location.properties,
        geometry: {
          create: userData.userPreferences.dataAnalytics.location.geometry,
        },
      },
    });

    const contacts = await prisma.contacts.create({
      data: {
        email: userData.userPreferences.contacts.email,
        phone: userData.userPreferences.contacts.phone,
      },
    });

    const dataAnalytics = await prisma.dataAnalytics.create({
      data: {
        locationUuid: location.uuid,
        budget: userData.userPreferences.dataAnalytics.budget,
        rating: userData.userPreferences.dataAnalytics.rating,
        willingnessToTravel:
          userData.userPreferences.dataAnalytics.willingnessToTravel,
      },
    });

    return prisma.preference.create({
      data: {
        contactUuid: contacts.uuid,
        dataUuid: dataAnalytics.uuid,
      },
    });
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
