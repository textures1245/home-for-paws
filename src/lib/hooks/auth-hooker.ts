// hooks/useCustomHook.ts
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { getCookie } from "../../lib/service/utils/cookies";

type AuthToken = {
  id: number;
  uuid: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export function useAuthHooker() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const authCookie = getCookie("AuthorizationToken");
    if (!process.env.NEXT_PUBLIC_JWT_SECRET)
      throw new Error("JWT secret not found");
    if (authCookie) {
      const authToken = authCookie.split(" ")[1];
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
  }, []);

  return data;
}
