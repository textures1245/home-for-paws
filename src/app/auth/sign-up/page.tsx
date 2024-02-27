"use client";

import AuthCard from "@/app/ui/AuthCard";
import { Button, Link } from "@radix-ui/themes";
import { FormEvent, use } from "react";
import { Auth as PrismaAuth } from "@prisma/client";
import authStore from "@/lib/service/state/store/authStore";
import { useRouter } from "next/navigation";
import { TError } from "@/lib/service/error/type";

export default function Page() {
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/singUp", {
      method: "POST",
      body: formData,
    });

    try {
      const authData = (await response.json()) as { auth: PrismaAuth };
      authStore().setAuth(authData.auth);
      router.push("/dashboard");
    } catch (e) {
      if (e instanceof TError) {
        if (e.redirectTo) {
          router.push(e.redirectTo);
        }
      }
    }
  }

  return (
    <AuthCard>
      <h2 className="text-2xl font-bold mb-6">สมัครบัญชีใหม่</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex items-center justify-between">
          <>
            <Button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              สมัคร
            </Button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/auth/sign-in"
            >
              สมัครบัญชีใหม่
            </Link>
          </>
        </div>
      </form>
    </AuthCard>
  );
}
