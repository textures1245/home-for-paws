import prisma from "@/lib/service/database/prisma/prisma.config";
import { Prisma } from "@prisma/client";
import { preferenceModel } from "../../model/preference/preference";
import { z } from "zod";
import prismaHandle from "../../error/prismaHandle";

const preferenceParamsModel = preferenceModel.pick({
  dataAnalytics: true,
  contacts: true,
});

export type PreferenceParams = z.infer<typeof preferenceParamsModel>;

export async function createPreference(prefData: PreferenceParams) {
  try {
    const location = await prisma.location.create({
      data: {
        type: prefData.dataAnalytics.location.type,
        properties: prefData.dataAnalytics.location.properties,
        geometry: {
          create: prefData.dataAnalytics.location.geometry,
        },
      },
    });

    const contacts = await prisma.contacts.create({
      data: {
        email: prefData.contacts.email,
        phone: prefData.contacts.phone,
      },
    });

    const dataAnalytics = await prisma.dataAnalytics.create({
      data: {
        locationUuid: location.uuid,
        budget: prefData.dataAnalytics.budget,
        rating: prefData.dataAnalytics.rating,
        willingnessToTravel: prefData.dataAnalytics.willingnessToTravel,
      },
    });

    return prisma.preference.create({
      data: {
        contactUuid: contacts.uuid,
        dataUuid: dataAnalytics.uuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function updatePreference(
  prefData: PreferenceParams,
  uuid: string
) {
  try {
    const location = await prisma.location.update({
      where: {
        uuid: uuid,
      },
      data: {
        type: prefData.dataAnalytics.location.type,
        properties: prefData.dataAnalytics.location.properties,
        geometry: {
          update: prefData.dataAnalytics.location.geometry,
        },
      },
    });

    const contacts = await prisma.contacts.update({
      where: {
        uuid: uuid,
      },
      data: {
        email: prefData.contacts.email,
        phone: prefData.contacts.phone,
      },
    });

    const dataAnalytics = await prisma.dataAnalytics.update({
      where: {
        uuid: uuid,
      },
      data: {
        locationUuid: location.uuid,
        budget: prefData.dataAnalytics.budget,
        rating: prefData.dataAnalytics.rating,
        willingnessToTravel: prefData.dataAnalytics.willingnessToTravel,
      },
    });

    return prisma.preference.update({
      where: {
        uuid: uuid,
      },
      data: {
        contactUuid: contacts.uuid,
        dataUuid: dataAnalytics.uuid,
      },
    });
  } catch (e) {
    throw prismaHandle(e);
  }
}

export async function getPreferenceByUserUuid(userUuid: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        uuid: userUuid,
      },
    });

    if (user) {
      return prisma.preference.findUnique({
        where: {
          uuid: user.userPreferenceUuid,
        },
      });
    }
  } catch (e) {
    throw prismaHandle(e);
  }
}
