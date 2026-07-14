"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HiOutlineSearchCircle, HiOutlinePlay } from "react-icons/hi";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="lg:col-span-7 flex flex-col gap-sm">
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden aspect-[4/3] relative group shadow-sm flex items-center justify-center">
        <Image
          alt="Product Main View"
          className="object-cover transition-opacity duration-300"
          src={images[activeImage]}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

      </div>
      <div className="grid grid-cols-5 gap-sm">
        {images.map((imgSrc, idx) => (
          <div
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`bg-surface rounded-lg overflow-hidden aspect-square cursor-pointer transition-all relative ${
              activeImage === idx
                ? "border-2 border-primary opacity-100"
                : "border border-outline-variant opacity-70 hover:opacity-100"
            }`}
          >
            <Image
              alt={`Thumbnail ${idx + 1}`}
              className="object-cover"
              src={imgSrc}
              fill
              sizes="20vw"
            />
          </div>
        ))}

      </div>
    </div>
  );
}
