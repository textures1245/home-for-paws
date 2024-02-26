import { z } from "zod";
import { geometrySchema } from "../geometry/geometry";

export const contactsModel = z.object({
  email: z.string(),
  phone: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const dataAnalyticsModel = z.object({
  location: geometrySchema,
  budget: z.number(),
  rating: z.number().max(5).min(0),
  willingnessToTravel: z.boolean(),
});

export const preferenceModel = z.object({
  id: z.string(),
  uid: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  contacts: contactsModel,
  dataAnalytics: dataAnalyticsModel,
});

export type Preference = z.infer<typeof preferenceModel>;
