"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import IntroText from "./IntroText";
import Slider from "react-slick";

export interface ProductItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: string;
  image: string;
  alt: string;
  href: string;
}

interface ImportExportProductsProps {
  id?: string;
  tagline?: string;
  title: string;
  description?: string;
  importItems: ProductItem[];
  exportItems: ProductItem[];
}

export default function ImportExportProducts({
  id = "import-export-products",
  tagline = "Global Trade",
  title,
  description,
  importItems,
  exportItems,
}: ImportExportProductsProps) {
  const sliderRef = useRef<Slider>(null);
  const [activeTab, setActiveTab] = useState<"Export" | "Import">("Export");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3.5);
  const [isSliderInit, setIsSliderInit] = useState(false);

  const activeItems = activeTab === "Export" ? exportItems : importItems;

  useEffect(() => {
    const updateSlidesToShow = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setSlidesToShow(1.2);
      } else if (w < 1024) {
        setSlidesToShow(2.4);
      } else {
        setSlidesToShow(3.5);
      }
    };
    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // Reset slide index when tab changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 400,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    onInit: () => setIsSliderInit(true),
    afterChange: (current: number) => setCurrentSlide(current),
    customPaging: (i: number) => {
      const lastDotIndex = Math.ceil(activeItems.length - slidesToShow);
      const maxSlideIndex = activeItems.length - slidesToShow;
      const isActive = i === currentSlide || (i === lastDotIndex && currentSlide >= maxSlideIndex - 0.01);
      return (
        <button className={isActive ? "slick-active-custom" : ""}>
          {i + 1}
        </button>
      );
    },
    appendDots: (dots: React.ReactNode) => {
      const dotsArray = React.Children.toArray(dots);
      if (dotsArray.length <= 5) {
        return <ul style={{ margin: "0px" }}>{dotsArray}</ul>;
      }
      const activeIndex = dotsArray.findIndex((dot: any) => {
        return dot.props?.className?.includes("slick-active") || 
               dot.props?.children?.props?.className?.includes("slick-active-custom");
      });
      const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
      let start = Math.max(0, safeActiveIndex - 2);
      let end = start + 5;
      if (end > dotsArray.length) {
        end = dotsArray.length;
        start = Math.max(0, end - 5);
      }
      return <ul style={{ margin: "0px" }}>{dotsArray.slice(start, end)}</ul>;
    }
  };

  const maxSlideIndex = Math.max(0, activeItems.length - slidesToShow);

  return (
    <section className="bg-surface w-full flex justify-center border-b border-outline-variant/10 overflow-hidden" id={id}>
      <div className="w-full inner-wrap pt-16">

        {/* Title container */}
        <div className="w-full container mx-auto px-gutter sm:px-0 flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-4">
          <div className="flex-grow max-w-3xl">
            <IntroText
              tagline={tagline}
              title={title}
              description={description}
              align="left"
              className="mb-0"
            />
          </div>
          {/* Slider controls */}
          <div className={`hidden md:flex gap-sm shrink-0 mb-sm md:mb-0 transition-opacity duration-300 ${isSliderInit ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              disabled={currentSlide === 0 || activeItems.length === 0}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-surface-low hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Previous slide"
            >
              <HiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              disabled={currentSlide >= maxSlideIndex || activeItems.length === 0}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-surface-low hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Next slide"
            >
              <HiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full container mx-auto px-gutter sm:px-0 mb-8">
          <div className="flex gap-6 border-b border-outline-variant/30">
            <button
              onClick={() => setActiveTab("Export")}
              className={`pb-3 font-headline-sm px-2 transition-colors relative ${activeTab === "Export" ? "text-primary" : "text-secondary hover:text-on-surface"}`}
            >
              Export Products
              {activeTab === "Export" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("Import")}
              className={`pb-3 font-headline-sm px-2 transition-colors relative ${activeTab === "Import" ? "text-primary" : "text-secondary hover:text-on-surface"}`}
            >
              Import Products
              {activeTab === "Import" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Slider wrapper */}
        <div className="w-full pl-gutter sm:pl-[calc((100%-640px)/2)] md:pl-[calc((100%-768px)/2)] lg:pl-[calc((100%-1024px)/2)] xl:pl-[calc((100%-1280px)/2)] 2xl:pl-[calc((100%-1536px)/2)]">
          {activeItems.length > 0 ? (
            <Slider key={activeTab} ref={sliderRef} {...settings} className="categories-slick-slider pb-lg">
              {activeItems.map((product, idx) => (
                <div key={idx} className="pr-lg pb-md select-none outline-none h-full">
                  <div className="group h-full bg-surface-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-grab active:cursor-grabbing">
                    <div className="h-48 overflow-hidden bg-surface-low relative">
                      {product.image && (
                        <Image
                          alt={product.alt}
                          className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          src={product.image}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                      {product.category && (
                        <div className="absolute top-sm right-sm bg-surface/90 backdrop-blur text-primary text-xs font-semibold px-2 py-1 rounded shadow-sm pointer-events-none">
                          {product.category}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                    <div className="p-lg flex flex-col flex-grow gap-4">
                      <div className="flex flex-col items-start justify-start gap-1">
                        <h3 className="text-headline-sm text-primary mb-0 group-hover:text-primary/95 line-clamp-2">
                          {product.title}
                        </h3>
                        {product.description && (
                          <p className="text-body-sm text-secondary line-clamp-2 my-1">
                            {product.description}
                          </p>
                        )}
                        <p className="text-label-sm font-semibold text-tertiary">
                          {product.price}
                        </p>
                      </div>
                      <a
                        className="text-label-md font-bold text-primary flex items-center gap-xs hover:underline mt-auto w-fit"
                        href={product.href}
                      >
                        View Details <HiArrowRight className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="py-12 text-secondary font-body-lg">
              No {activeTab.toLowerCase()} products available at the moment.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
