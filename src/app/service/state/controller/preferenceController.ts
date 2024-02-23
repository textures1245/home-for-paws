import prisma from "@/app/service/database/prisma/prisma.config";
import { Prisma } from "@prisma/client";
import { preferenceModel } from "../../model/perference/perference";
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
