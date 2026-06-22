import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const parentCategory = formData.get("parentCategory") as string;
    const imageEntry = formData.get("image");
    const file = imageEntry instanceof File ? imageEntry : null;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    let image = category.image;
    let cloudinaryId = category.cloudinaryId;

    // If new image uploaded, delete old one and upload new one
    if (file && file.size > 0) {
      if (cloudinaryId) {
        await deleteImageFromCloudinary(cloudinaryId);
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadImageToCloudinary(buffer, "bb-enterprise/categories");
      image = uploadResult.url;
      cloudinaryId = uploadResult.public_id;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || category.name,
        description: description ?? category.description,
        status: status || category.status,
        parentCategory: parentCategory ?? category.parentCategory,
        image,
        cloudinaryId,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }

    if (category.cloudinaryId) {
      await deleteImageFromCloudinary(category.cloudinaryId);
    }

    await Category.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: "Category deleted" });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}
