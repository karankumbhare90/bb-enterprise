import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  // Redirect the root admin path to the products catalog by default.
  redirect("/admin/products");
}
