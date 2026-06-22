"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ 
  children, 
  settings 
}: { 
  children: React.ReactNode,
  settings?: any
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar settings={settings} />}
      {children}
      {!isAdmin && <Footer settings={settings} />}
    </>
  );
}
