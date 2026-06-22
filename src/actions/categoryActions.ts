"use server";

import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function createCategory(prevState: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const parentCategory = formData.get("parentCategory") as string;
    const file = formData.get("image") as File | null;

    if (!name) {
      return { error: "Category name is required" };
    }

    await connectDB();

    // Check if category already exists
    const existing = await Category.findOne({ name });
    if (existing) {
      return { error: "A category with this name already exists" };
    }

    let image = "";
    let cloudinaryId = "";

    // Upload image if provided
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadImageToCloudinary(buffer, "bb-enterprise/categories");
      image = uploadResult.url;
      cloudinaryId = uploadResult.public_id;
    }

    await Category.create({
      name,
      description,
      image,
      cloudinaryId,
      status: status || "Active",
      parentCategory: parentCategory || "",
    });

    revalidatePath("/admin/categories");
    return { success: "Category created successfully!" };
  } catch (error: any) {
    console.error("Create Category Error:", error);
    return { error: "Failed to create category. Please try again." };
  }
}

export async function deleteCategory(id: string) {
  try {
    await connectDB();
    const category = await Category.findById(id);

    if (!category) {
      return { error: "Category not found" };
    }

    // Delete image from Cloudinary if it exists
    if (category.cloudinaryId) {
      await deleteImageFromCloudinary(category.cloudinaryId);
    }

    await Category.findByIdAndDelete(id);

    revalidatePath("/admin/categories");
    return { success: "Category deleted successfully!" };
  } catch (error: any) {
    console.error("Delete Category Error:", error);
    return { error: "Failed to delete category" };
  }
}
