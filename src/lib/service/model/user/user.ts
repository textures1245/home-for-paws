import { z } from "zod";
import { preferenceModel } from "@/lib/service/model/preference/preference";
import { authModel } from "@/lib/service/model/user/auth";

export const userModel = z.object({
  id: z.number().positive(),
  uid: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userRole: z.enum(["ADMIN", "USER_SENDER", "USER_ADOPTER"]),
  userPreferences: preferenceModel,
});

export type User = z.infer<typeof userModel>;
