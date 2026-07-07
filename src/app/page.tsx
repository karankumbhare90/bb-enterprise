import React from "react";
import nextDynamic from "next/dynamic";
import Hero from "../components/Hero";
import StatsCounter from "../components/StatsCounter";
const HowItWorks = nextDynamic(() => import("../components/HowItWorks"));
import IntroText from "../components/IntroText";
const Categories = nextDynamic(() => import("../components/Categories"));
const Features = nextDynamic(() => import("../components/Features"));
const Gallery = nextDynamic(() => import("../components/Gallery"));
const OurTeam = nextDynamic(() => import("../components/OurTeam"));
const Faq = nextDynamic(() => import("../components/Faq"));
const ContactSection = nextDynamic(() => import("../components/ContactSection"));
import FeaturedProducts from "../components/FeaturedProducts";
const ImportExportProducts = nextDynamic(() => import("../components/ImportExportProducts"));

import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Setting from "@/models/Setting";

export const dynamic = "force-dynamic";

export default async function Home() {
  await connectDB();

  // Fetch active categories
  const categoriesDocs = await Category.find({ status: "Active" }).sort({ sortOrder: 1, createdAt: -1 }).lean();
  const categories = categoriesDocs.map(doc => ({
    _id: doc._id.toString(),
    title: doc.name,
    description: doc.description || `Explore our high-quality ${doc.name} globally sourced for wholesale.`,
    image: doc.image || "",
    alt: doc.name,
    href: `/collections/${doc.slug || doc._id}`,
  }));

  // Fetch Export and Import products
  const exportDocs = await Product.find({ status: "Active", $or: [{ tradeType: "Export" }, { tradeType: { $exists: false } }] })
    .populate("category", "name")
    .limit(20)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const importDocs = await Product.find({ status: "Active", tradeType: "Import" })
    .populate("category", "name")
    .limit(20)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const mapProductDoc = (prod: any) => ({
    id: prod._id.toString(),
    title: prod.name,
    description: prod.description || "",
    category: prod.category?.name || "",
    price: `MOQ: ${prod.moq} ${prod.unit}`,
    image: prod.images?.[0]?.url || "",
    alt: prod.name,
    href: `/product/${prod.slug || prod._id}`,
  });

  const exportItems = exportDocs.map(mapProductDoc);
  const importItems = importDocs.map(mapProductDoc);

  // Fetch settings for contact info
  const setting = await Setting.findOne();
  const settingsObj = setting ? JSON.parse(JSON.stringify(setting)) : null;

  return (
    <>
      <main className="min-h-screen bg-background text-text-primary pt-20 flex flex-col items-center overflow-x-hidden">
        <Hero />
        <StatsCounter />
        <HowItWorks />

        {categories.length > 0 && (
          <Categories
            title="Premium Export Product Categories"
            description="Explore our comprehensive range of high-quality export commodities, ethically sourced and stringently verified for global trade."
            items={categories}
          />
        )}

        {(exportItems.length > 0 || importItems.length > 0) && (
          <ImportExportProducts
            title="Our Global Trading Catalog"
            description="Explore our specialized selection of products for both import and export. We connect the best global manufacturers with premium buyers worldwide."
            exportItems={exportItems}
            importItems={importItems}
          />
        )}

        <Features />

        <Gallery />

        <OurTeam />

        <Faq />

        {/* Contact Section */}
        <ContactSection settings={settingsObj} />

      </main>
    </>
  );
}
