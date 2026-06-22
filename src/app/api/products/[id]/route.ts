import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(id).populate("category", "name");
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

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

    // Parse JSON fields
    let technicalParameters = product.technicalParameters;
    let packagingLogistics = product.packagingLogistics;
    let existingImages: { url: string; cloudinaryId: string }[] = [];

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

    try {
      const existingImagesStr = formData.get("existingImages") as string;
      if (existingImagesStr) existingImages = JSON.parse(existingImagesStr);
    } catch (e) {
      console.warn("Failed to parse existingImages");
    }

    // Handle Image Deletions
    // Images that are currently in DB but NOT in existingImages from formData should be deleted
    const imagesToDelete = product.images.filter(
      (dbImg: any) => !existingImages.some((exImg) => exImg.cloudinaryId === dbImg.cloudinaryId)
    );

    for (const img of imagesToDelete) {
      if (img.cloudinaryId) {
        await deleteImageFromCloudinary(img.cloudinaryId);
      }
    }

    // Handle New Image Uploads
    const imageFiles = formData.getAll("images");
    const newUploadedImages = [];

    for (const entry of imageFiles) {
      if (entry instanceof File && entry.size > 0) {
        const buffer = Buffer.from(await entry.arrayBuffer());
        const uploadResult = await uploadImageToCloudinary(
          buffer,
          "bb-enterprise/products"
        );
        newUploadedImages.push({
          url: uploadResult.url,
          cloudinaryId: uploadResult.public_id,
        });
      }
    }

    const updatedImages = [...existingImages, ...newUploadedImages];

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        category: category || product.category,
        description: description ?? product.description,
        status: status || product.status,
        tradeType: tradeType || product.tradeType,
        minPrice: minPrice ? Number(minPrice) : product.minPrice,
        maxPrice: maxPrice ? Number(maxPrice) : product.maxPrice,
        moq: moq ? Number(moq) : product.moq,
        unit: unit || product.unit,
        technicalParameters,
        packagingLogistics,
        images: updatedImages,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    console.error("PUT Product Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await context.params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete all images associated with the product from Cloudinary
    for (const img of product.images) {
      if (img.cloudinaryId) {
        await deleteImageFromCloudinary(img.cloudinaryId);
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
