"use server";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/lib/service/database/prisma/prisma.config";
import { z } from "zod";
import { cookies } from "next/headers";
import authStore from "@/lib/service/state/store/authStore";
import { ifUserExists } from "./userController";
import { schemaValidate } from "../../error/zodValidation";
import { ToastData } from "../../utils/toast.config";
import { TError } from "../../error/type";

export const authCredentialsModel = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(/^(?=.*[!@#$%^&*])/)
    .min(6)
    .max(100),
});

export type AuthCredential = z.infer<typeof authCredentialsModel>;

export async function validateCredential(reqData: AuthCredential) {
  const { email, password } = schemaValidate(authCredentialsModel)(reqData);

  const auth = await prisma.auth.findUnique({
    where: {
      email,
    },
  });

  if (!auth) {
    throw new TError("รหัสผ่านหรือโทเคนไม่ถูกต้อง", "error", 404);
  }

  const valid = await bcrypt.compare(password, auth.password);
  const token = jwt.sign(auth, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  if (!valid) {
    throw new TError("รหัสผ่านหรือโทเคนไม่ถูกต้อง", "error", 404);
  } else {
    const user = await ifUserExists(auth.email);
    if (!user) {
      // - redirect to sign-up page
      throw new TError(
        "คุณยังไม่ได้ลงทะเบียนข้อมูล โปรดลงทะเบียนข้อมูล",
        "warning",
        401,
        "/auth/user-preference-registration"
      );
    }
  }

  return { auth, token };
}

export async function createAuthCredential(reqData: AuthCredential) {
  const { email, password } = schemaValidate(authCredentialsModel)(reqData);

  try {
    const auth = await prisma.auth.create({
      data: {
        email: email,
        password: await bcrypt.genSalt(13).then(async (salt) => {
          return bcrypt.hash(password, salt).then((hash) => {
            console.log(`info: hash generated: ${hash}`);
            return hash;
          });
        }),
      },
    });
    const token = jwt.sign(auth, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return { auth, token };
  } catch (err) {
    throw "User already exists";
  }
}
