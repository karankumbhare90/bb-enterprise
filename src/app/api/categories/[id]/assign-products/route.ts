import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { productIds } = body;

    if (!Array.isArray(productIds)) {
      return NextResponse.json({ success: false, error: "productIds must be an array" }, { status: 400 });
    }

    // First, unset the category for products that currently have this category but are not in the new list
    await Product.updateMany(
      { category: id, _id: { $nin: productIds } },
      { $unset: { category: "" } }
    );

    // Update all selected products to point to this category
    await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { category: id } }
    );

    return NextResponse.json({ success: true, message: "Products assigned successfully" });
  } catch (error: any) {
    console.error("Assign Products Error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Failed to assign products" }, { status: 500 });
  }
}
