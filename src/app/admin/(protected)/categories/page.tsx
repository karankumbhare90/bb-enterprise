import { getCategories } from "@/actions/categoryActions";
import AdminCategoriesClient from "./AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <AdminCategoriesClient initialCategories={categories} />;
}
