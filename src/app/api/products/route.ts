import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tradeType = searchParams.get("tradeType");

    await connectDB();
    const query: any = {};
    if (tradeType) {
      query.tradeType = tradeType;
    }

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ sortOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const tradeType = formData.get("tradeType") as string;
    const minPrice = formData.get("minPrice") as string;
    const maxPrice = formData.get("maxPrice") as string;
    const moq = formData.get("moq") as string;
    const unit = formData.get("unit") as string;
    
    // Parse JSON arrays for technical parameters and packaging logistics
    let technicalParameters = [];
    let packagingLogistics = [];
    
    try {
      const techParamsStr = formData.get("technicalParameters") as string;
      if (techParamsStr) technicalParameters = JSON.parse(techParamsStr);
    } catch (e) {
      console.warn("Failed to parse technicalParameters");
    }

    try {
      const packLogStr = formData.get("packagingLogistics") as string;
      if (packLogStr) packagingLogistics = JSON.parse(packLogStr);
    } catch (e) {
      console.warn("Failed to parse packagingLogistics");
    }

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    // Handle multiple images
    const imageFiles = formData.getAll("images");
    const uploadedImages = [];

    for (const entry of imageFiles) {
      if (entry instanceof File && entry.size > 0) {
        const buffer = Buffer.from(await entry.arrayBuffer());
        const uploadResult = await uploadImageToCloudinary(
          buffer,
          "bb-enterprise/products"
        );
        uploadedImages.push({
          url: uploadResult.url,
          cloudinaryId: uploadResult.public_id,
        });
      }
    }

    const newProduct = await Product.create({
      name,
      category,
      description,
      status: status || "Active",
      tradeType: tradeType || "Export",
      images: uploadedImages,
      minPrice: minPrice ? Number(minPrice) : 0,
      maxPrice: maxPrice ? Number(maxPrice) : 0,
      moq: moq ? Number(moq) : 1,
      unit: unit || "Units",
      technicalParameters,
      packagingLogistics,
    });

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Product Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
