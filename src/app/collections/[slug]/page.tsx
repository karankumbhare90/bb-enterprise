import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight, HiArrowRight } from "react-icons/hi";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: {
      canonical: `/collections/${slug}`,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  await connectDB();

  let category = null;
  try {
    category = await Category.findOne({ slug }).lean();
  } catch (e) {
    //
  }

  if (!category) {
    notFound();
  }

  // Fetch products for this category
  const products = await Product.find({ category: category._id, status: "Active" })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Categories", href: "/#collections" },
    { label: category.name, href: "#" },
  ];

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
        <div className="mb-12">
          <h1 className="text-display-sm text-primary mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-body-lg text-text-secondary w-full">
              {category.description}
            </p>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const image = product.images?.[0]?.url || "";
              const price = `MOQ: ${product.moq} ${product.unit}`;
              return (
                <Link
                  key={product._id.toString()}
                  href={`/product/${product.slug}`}
                  className="group h-full bg-surface-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  <div className="h-48 overflow-hidden bg-surface-low relative">
                    {image && (
                      <Image
                        alt={product.name}
                        className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                        src={image}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  <div className="p-6 flex flex-col flex-grow gap-4">
                    <div className="flex flex-col items-start justify-start gap-1">
                      <h3 className="text-headline-sm text-primary mb-0 group-hover:text-primary/95 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-body-sm text-secondary line-clamp-2 my-1">
                          {product.description}
                        </p>
                      )}
                      <p className="text-label-sm font-semibold text-tertiary">
                        {price}
                      </p>
                    </div>
                    <div className="text-label-md font-bold text-primary flex items-center gap-xs mt-auto w-fit group-hover:underline">
                      View Details <HiArrowRight className="text-sm" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-secondary font-body-lg text-center bg-surface-low rounded-xl border border-outline-variant/20">
            No products found in this category.
          </div>
        )}
      </div>
    </main>
  );
}
