import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const parentCategory = formData.get("parentCategory") as string;
    const imageEntry = formData.get("image");
    const file = imageEntry instanceof File ? imageEntry : null;

    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return NextResponse.json({ success: false, error: "A category with this name already exists" }, { status: 400 });
    }

    let image = "";
    let cloudinaryId = "";

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadImageToCloudinary(buffer, "bb-enterprise/categories");
      image = uploadResult.url;
      cloudinaryId = uploadResult.public_id;
    }

    const newCategory = await Category.create({
      name,
      description,
      image,
      cloudinaryId,
      status: status || "Active",
      parentCategory: parentCategory || "",
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to create category" }, { status: 500 });
  }
}
