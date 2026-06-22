"use client";

import React from "react";
import { HiBadgeCheck, HiShieldCheck, HiCurrencyDollar, HiGlobe } from "react-icons/hi";
import IntroText from "./IntroText";
import { featuresData } from "../data/data";

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesProps {
  id?: string;
  tagline?: string;
  title?: string;
  description?: string;
  items?: FeatureItem[];
}

const renderFeatureIcon = (icon: string) => {
  switch (icon) {
    case "verified":
      return <HiBadgeCheck className="text-3xl text-primary" />;
    case "high_quality":
      return <HiShieldCheck className="text-3xl text-primary" />;
    case "price_check":
      return <HiCurrencyDollar className="text-3xl text-primary" />;
    case "public":
      return <HiGlobe className="text-3xl text-primary" />;
    default:
      return <HiBadgeCheck className="text-3xl text-primary" />;
  }
};

export default function Features({
  id = "features",
  tagline = "Core Competence",
  title = featuresData.title,
  description = featuresData.description,
  items = featuresData.items,
}: FeaturesProps) {
  return (
    <section className=" bg-surface-low/50 w-full" id={id}>
      <div className="inner-wrap">
        <div className="container mx-auto sm:px-0 w-full px-gutter">
          <IntroText
            tagline={tagline}
            title={title}
            description={description}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
            {items.map((feature, idx) => (
              <div
                key={idx}
                className="bg-surface-lowest p-lg rounded-xl border border-outline-variant/20 shadow-sm flex flex-col items-start hover:shadow-md hover:translate-y-[-2px] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-low border border-outline-variant/10 flex items-center justify-center mb-md shadow-inner">
                  {renderFeatureIcon(feature.icon)}
                </div>
                <h3 className="text-headline-sm text-primary mb-xs">
                  {feature.title}
                </h3>
                <p className="text-body-sm text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
