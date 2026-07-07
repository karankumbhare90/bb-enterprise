import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const generateSlug = (name: string, suffix = "") => {
      const base = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      return base + suffix;
    };

    // Migrate Categories
    const categories = await Category.find();
    let catUpdated = 0;
    for (const cat of categories) {
      if (!cat.slug) {
        cat.slug = generateSlug(cat.name);
        try {
          await cat.save();
        } catch (e: any) {
          if (e.code === 11000) {
            cat.slug = generateSlug(cat.name, "-" + Math.floor(Math.random() * 10000));
            await cat.save();
          }
        }
        catUpdated++;
      }
    }

    // Migrate Products
    const products = await Product.find();
    let prodUpdated = 0;
    for (const prod of products) {
      if (!prod.slug) {
        prod.slug = generateSlug(prod.name);
        try {
          await prod.save();
        } catch (e: any) {
          if (e.code === 11000) {
            prod.slug = generateSlug(prod.name, "-" + Math.floor(Math.random() * 10000));
            await prod.save();
          }
        }
        prodUpdated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migrated ${catUpdated} categories and ${prodUpdated} products.`,
    });
  } catch (error: any) {
    console.error("Migration Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
