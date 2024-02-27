import React from "react";
import AuthCard from "../ui/AuthCard";
import "@/app/globals.css";



export default function Layout({ children }: { children: React.ReactNode }) {
  return <main className="grid thai-font place-items-center h-screen w-full ">{children}</main>;
}
