"use client";

import React from "react";
import { HiArrowRight, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import IntroText from "./IntroText";

import Slider from "react-slick";

export interface FeaturedProductItem {
  title: string;
  description?: string;
  category: string;
  price: string;
  image: string;
  alt: string;
  href: string;
}

interface FeaturedProductsProps {
  id?: string;
  tagline?: string;
  title: string;
  description?: string;
  items: FeaturedProductItem[];
}

export default function FeaturedProducts({
  id = "featured-products",
  tagline = "Top Picks",
  title,
  description,
  items,
}: FeaturedProductsProps) {
  const sliderRef = React.useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [slidesToShow, setSlidesToShow] = React.useState(3.5);
  const [isSliderInit, setIsSliderInit] = React.useState(false);

  React.useEffect(() => {
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
      const lastDotIndex = Math.ceil(items.length - slidesToShow);
      const maxSlideIndex = items.length - slidesToShow;
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

  const maxSlideIndex = Math.max(0, items.length - slidesToShow);

  return (
    <section className="bg-surface w-full flex justify-center border-b border-outline-variant/10 overflow-hidden" id={id}>
      <div className="w-full inner-wrap pt-16">

        {/* Title container */}
        <div className="w-full container mx-auto px-gutter sm:px-0 flex flex-col md:flex-row md:items-end md:justify-between gap-md mb-8">
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
              disabled={currentSlide === 0}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-surface-low hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Previous slide"
            >
              <HiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={() => sliderRef.current?.slickNext()}
              disabled={currentSlide >= maxSlideIndex}
              className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center text-primary hover:bg-surface-low hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
              aria-label="Next slide"
            >
              <HiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Slider wrapper */}
        <div className="w-full pl-gutter sm:pl-[calc((100%-640px)/2)] md:pl-[calc((100%-768px)/2)] lg:pl-[calc((100%-1024px)/2)] xl:pl-[calc((100%-1280px)/2)] 2xl:pl-[calc((100%-1536px)/2)]">
          <Slider ref={sliderRef} {...settings} className="categories-slick-slider pb-lg">
            {items.map((product, idx) => (
              <div key={idx} className="pr-lg pb-md select-none outline-none h-full">
                <div className="group h-full bg-surface-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-grab active:cursor-grabbing">
                  <div className="h-48 overflow-hidden bg-surface-low relative">
                    <img
                      alt={product.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      src={product.image}
                    />
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
        </div>

      </div>
    </section>
  );
}
