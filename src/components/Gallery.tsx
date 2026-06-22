"use client";

import React from "react";
import Masonry from "react-masonry-css";
import IntroText from "./IntroText";
import { galleryData } from "../data/data";

export interface GalleryImage {
  src: string;
  alt: string;
  heightClass?: string; // e.g. "h-64", "h-80", "h-96"
}

interface GalleryProps {
  id?: string;
  tagline?: string;
  title?: string;
  description?: string;
  images?: GalleryImage[];
}

export default function Gallery({
  id = "gallery",
  tagline = "Visual Showcase",
  title = galleryData.title,
  description = galleryData.description,
  images = galleryData.images,
}: GalleryProps) {
  // Masonry column breakpoints
  const breakpointCols = {
    default: 4,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <section className="bg-surface w-full flex justify-center border-t border-outline-variant/10" id={id}>
      <div className="w-full inner-wrap">
        <div className="container mx-auto w-full px-gutter sm:px-0">
          <IntroText
            tagline={tagline}
            title={title}
            description={description}
          />

          <Masonry
            breakpointCols={breakpointCols}
            className="flex -ml-md w-auto"
            columnClassName="pl-md bg-clip-padding"
          >
            {images.map((img, idx) => {
              // Pick a height class for masonry staggered look if not provided
              // Let's use a deterministic height sequence based on index if no heightClass is supplied
              const heights = ["h-64", "h-80", "h-96", "h-72"];
              const height = img.heightClass || heights[idx % heights.length];

              return (
                <div
                  key={idx}
                  className={`w-full ${height} mb-md rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm relative group`}
                >
                  <img
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
                    src={img.src}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none flex items-end p-lg">
                    <span className="text-white font-semibold text-headline-sm tracking-tight">
                      {img.alt}
                    </span>
                  </div>
                </div>
              );
            })}
          </Masonry>
        </div>
      </div>
    </section>
  );
}
