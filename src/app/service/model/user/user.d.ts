import { z } from "zod";
import { preferenceModel } from "@/app/service/model/preference/preference";
import { authModel } from "@/app/service/model/user/auth";

export const userModel = z.object({
  id: z.number().positive(),
  uid: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userRole: z.enum(["ADMIN", "USER_SENDER", "USER_ADOPTER"]),
  userPreferences: preferenceModel,
  auth: authModel,
});

export type User = z.infer<typeof userModel>;
