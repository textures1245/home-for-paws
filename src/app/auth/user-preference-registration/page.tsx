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
    const response = await fetch("/api/preference-resistor", {
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
      <h2 className="text-2xl font-bold mb-2">สมัครบัญชีใหม่</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            ชื่อผู้ใช้
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="name"
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            อีเมลติดต่อ
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            name="email"
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="age"
          >
            อายุ
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="age"
            type="number"
            name="age"
          />
        </div>
        <div className="flex justify-between items-center my-3">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="willingnessToTravel"
          >
            สามารถนำไปส่งได้
          </label>
          <input
            className="shadow appearance-none border py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="willingnessToTravel"
            type="checkbox"
            name="willingnessToTravel"
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="address"
          >
            ที่อยู่
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="string"
            name="address"
            placeholder="Enter your password"
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="phone"
          >
            โทรศัพท์
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="address"
            type="string"
            name="address"
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="budget"
          >
            เงินทุน
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="budget"
            type="string"
            name="budget"
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
