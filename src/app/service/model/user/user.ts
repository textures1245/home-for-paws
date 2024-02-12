import { z } from "zod";
import { preferenceModel } from "../perference/perference";

export const authModel = z.object({
  id: z.string(),
  uid: z.string(),
  email: z.string(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userModel = z.object({
  id: z.string(),
  uid: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userPreferences: preferenceModel,
  auth: authModel,
});

export type Auth = z.infer<typeof authModel>;

export type User = z.infer<typeof userModel>;
