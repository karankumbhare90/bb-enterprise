import React from "react";
import { redirect } from "next/navigation";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { verifySessionDB } from "@/actions/authActions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Ensure the DB session actually exists for all protected admin routes
  console.log("[Layout] Checking session in DB");
  const isValidSession = await verifySessionDB();
  console.log("[Layout] isValidSession:", isValidSession);

  if (!isValidSession) {
    console.log("[Layout] Redirecting to login");
    redirect("/admin/login");
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
