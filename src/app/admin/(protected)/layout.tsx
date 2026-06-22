import React from "react";
import { redirect } from "next/navigation";
import AdminDashboardLayout from "@/components/AdminDashboardLayout";
import { verifySessionDB } from "@/actions/authActions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Ensure the DB session actually exists for all protected admin routes
  const isValidSession = await verifySessionDB();

  if (!isValidSession) {
    redirect("/admin/login");
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
