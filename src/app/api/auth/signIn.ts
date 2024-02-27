import {
  AuthCredential,
  createAuthCredential,
  validateCredential,
} from "@/lib/service/state/controller/authController";
import type { NextApiRequest, NextApiResponse } from "next";

import "server-only";
import { cookies } from "next/headers";
import { TError } from "@/lib/service/error/type";

// `server-only` guarantees any modules that import code in file
// will never run on the client. Even though this particular api
// doesn't currently use sensitive environment variables, it's
// good practise to add `server-only` preemptively.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body as AuthCredential;
  try {
    const { auth, token } = await validateCredential(data);

    cookies().set("AuthorizationToken", `Bearer ${token}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    res.status(200).json({ auth });
  } catch (e) {
    if (e instanceof TError) {
      res.status(e.statusCode).json({ e });
    } else {
      throw new Error("something went wrong");
    }
  }
}
