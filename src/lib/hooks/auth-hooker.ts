// hooks/useCustomHook.ts
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

type AuthToken = {
  id: number;
  uuid: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export function useAuthHooker(req: NextRequest) {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const authCookie = req.cookies.get("AuthorizationToken");
    if (!process.env.NEXT_PUBLIC_JWT_SECRET)
      throw new Error("JWT secret not found");
    if (authCookie) {
      const authToken = authCookie.value.split(" ")[1];
      try {
        const jwtAuth = jwt.verify(
          authToken,
          process.env.NEXT_PUBLIC_JWT_SECRET || ""
        );

        if (!jwtAuth) throw new Error("token not found or invalid");
        setData((jwtAuth as jwt.JwtPayload).uuid);
      } catch (error) {
        console.error(error);
      }
    }
  }, [req.cookies]);

  return data;
}
