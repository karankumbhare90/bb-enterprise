import React from "react";
import Link from "next/link";
import { HiChevronRight } from "react-icons/hi";
import ProductGallery from "../../../components/ProductGallery";
import ProductInfo from "../../../components/ProductInfo";
import ProductTabs from "../../../components/ProductTabs";
import ProductInquiryForm from "../../../components/ProductInquiryForm";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  await connectDB();

  // Ensure Category model is registered
  const categoryModel = Category;

  let product = null;
  try {
    product = await Product.findOne({ slug }).populate("category").lean();
  } catch (e) {
    //
  }

  if (!product) {
    notFound();
  }

  const categoryName = product.category?.name || "Uncategorized";

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: categoryName, href: product.category?.slug ? `/collections/${product.category.slug}` : "/#category" },
    { label: product.name, href: "#" },
  ];

  // Gallery
  const gallery = product.images && product.images.length > 0
    ? product.images.map((img: any) => img.url)
    : ["https://lh3.googleusercontent.com/aida-public/AB6AXuCADksutRJAsXwV5VkVvj8hTFOCaaKaCHBVHimk0VH-5_UwR0oSYcJlJ_E83uErumJLAVKkvo841XSSQlw-Q8X-wa2MDQx7wM7MTg0N4ZSyRJn6pHz1UX8lqd6wiTaYzemdprfLFBBnYEp2tFyyVzKCuBXXdCcx95hyiP9P7qmzdlaeFA5EbY8a6PljK_jjlXMefg-jcWyZZFDcTjK_CcG82QHUjiwFaIEcG12cHvxSTmvMnU-RPxVw_fzgdC9OE5kpulIZ43RQ9HY"];

  // Key Specs
  let keySpecs = [];
  if (product.technicalParameters && product.technicalParameters.length > 0) {
    keySpecs = product.technicalParameters.slice(0, 4).map((p: any) => ({
      icon: "verified",
      label: (p.name || p.key) + ":",
      value: p.value
    }));
  } else {
    keySpecs = [
      { icon: "inventory", label: "Trade Type:", value: product.tradeType || "N/A" },
      { icon: "inventory_2", label: "Status:", value: product.status || "N/A" },
      { icon: "category", label: "Category:", value: categoryName },
    ];
  }

  const priceObj = {
    fob: product.minPrice || product.maxPrice ? `$${product.minPrice || 0} - $${product.maxPrice || 0}` : "Contact for Price",
    unit: `/ ${product.unit || "Unit"}`,
    moq: `${product.moq || 1} ${product.unit || "Unit"}`
  };

  const tabsData = {
    overview: [
      product.description || "No description available."
    ],
    technicalParameters: product.technicalParameters
      ? product.technicalParameters.map((p: any) => ({ key: p.name || p.key || "", value: p.value || "" }))
      : [],
    packaging: product.packagingLogistics && product.packagingLogistics.length > 0
      ? product.packagingLogistics.map((p: any) => ({ icon: p.icon || "inventory_2", label: p.label || p.name || "Packaging", text: p.text || p.value || "" }))
      : []
  };

  return (
    <main className="flex-grow pt-24 pb-2xl bg-background min-h-screen">
      {/* Breadcrumb & Header */}
      <div className="bg-surface-container-low border-b border-outline-variant py-md mb-lg">
        <div className="container mx-auto px-gutter sm:px-0">
          <nav aria-label="Breadcrumb" className="flex text-body-sm font-body-sm text-on-surface-variant mb-sm overflow-x-auto whitespace-nowrap w-full scrollbar-hide">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 w-full">
              {breadcrumbs.map((crumb, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === breadcrumbs.length - 1;
                const isMiddle = !isFirst && !isLast;

                return (
                  <React.Fragment key={idx}>
                    <li className={`inline-flex items-center ${isMiddle ? "hidden md:inline-flex" : ""}`}>
                      {idx > 0 && <HiChevronRight className="text-sm mx-1 shrink-0" />}
                      {isLast ? (
                        <span className="text-on-surface font-medium truncate max-w-[150px] sm:max-w-[250px] md:max-w-none block" title={crumb.label}>
                          {crumb.label}
                        </span>
                      ) : (
                        <Link href={crumb.href} className="hover:text-primary transition-colors whitespace-nowrap">
                          {crumb.label}
                        </Link>
                      )}
                    </li>
                    {isFirst && breadcrumbs.length > 2 && (
                      <li className="inline-flex items-center md:hidden">
                        <HiChevronRight className="text-sm mx-1 shrink-0" />
                        <span className="text-on-surface-variant font-medium tracking-widest px-1">...</span>
                      </li>
                    )}
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-gutter sm:px-0">
        {/* Product Detail Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl mb-2xl">
          <ProductGallery images={gallery} />
          <ProductInfo
            title={product.name}
            model={`ID-` + product._id.toString().slice(-6).toUpperCase()}
            origin="Global Source"
            price={priceObj}
            tags={["Verified Supplier", product.tradeType || "Export"]}
            keySpecs={keySpecs}
          />
        </div>

        {/* Detailed Content Tabs/Bento Grid */}
        <ProductTabs tabsData={tabsData} />

        {/* Inquiry Form */}
        <ProductInquiryForm productName={product.name} />
      </div>
    </main>
  );
}
