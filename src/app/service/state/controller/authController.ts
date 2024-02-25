import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/app/service/database/prisma/prisma.config";
import { z } from "zod";
import { cookies } from "next/headers";
import authStore from "@/app/service/state/store/authStore";
import { ifUserExists } from "./userController";
import { redirect } from "next/navigation";
import { schemaValidate } from "../../error/zodValidation";

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
    throw new Error("Auth not found");
  }

  const valid = await bcrypt.compare(password, auth.password);
  const token = jwt.sign(auth, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });

  if (!valid) {
    throw new Error("Invalid password");
  } else {
    const user = await ifUserExists(auth.email);
    if (!user) {
      // - redirect to sign-up page
      redirect("/auth/sign-up");
    }

    authStore((state) => state.setAuth(auth));
    cookies().set("AuthorizationToken", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  }

  return auth;
}

export async function createAuthCredential(reqData: AuthCredential) {
  const { email, password } = schemaValidate(authCredentialsModel)(reqData);

  try {
    const user = await prisma.auth.create({
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
    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    //- set token
    cookies().set("AuthorizationToken", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return user;
  } catch (err) {
    console.error(err);
    throw new Error("User already exists");
  }
}
