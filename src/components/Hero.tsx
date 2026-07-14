

import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import { heroData } from "../data/data";

export default function Hero() {
  return (
    <section className="w-full hero-banner relative bg-surface-low/80">
      <div className="inner-wrap">
        <div className="container mx-auto px-gutter sm:px-0 grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">

          {/* Hero Copy Content */}
          <div className="max-w-2xl flex flex-col items-start lg:items-start">
            <span className="text-label-sm font-semibold tracking-wider text-secondary uppercase mb-sm">
              Next-Gen Sourcing Hub
            </span>
            <h1 className="text-display-lg text-primary tracking-tight mb-md leading-tight">
              {heroData.title}
            </h1>
            <p className="text-body-lg text-text-secondary mb-xl leading-relaxed">
              {heroData.description}
            </p>
            <div className="flex flex-wrap gap-md justify-center lg:justify-start">
              <a
                href={heroData.ctaPrimary.href}
                className="btn button-success"
              >
                {heroData.ctaPrimary.label} <HiArrowRight className="text-sm" />
              </a>
              <a
                href={heroData.ctaSecondary.href}
                className="btn button-secondary"
              >
                {heroData.ctaSecondary.label}
              </a>
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="relative h-[320px] sm:h-[450px] lg:h-[550px] w-full rounded-2xl overflow-hidden shadow-lg border border-outline-variant/10">
            <Image
              alt={heroData.alt}
              className="object-cover transition-transform duration-700 hover:scale-105"
              src={heroData.image}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
