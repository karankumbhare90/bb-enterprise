"use client";

import React from "react";
import { HiCheckCircle, HiOutlinePaperAirplane } from "react-icons/hi";

// To avoid a massive icon library load, we can use Material Symbols directly via a font (like in HTML) or use react-icons
// I'll stick to a simple mapping for the keyspecs icon names if needed, or just standard react-icons.
import { MdPrecisionManufacturing, MdAspectRatio, MdMemory, MdVerified } from "react-icons/md";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "precision_manufacturing":
      return <MdPrecisionManufacturing className="text-on-surface-variant mr-sm text-xl" />;
    case "aspect_ratio":
      return <MdAspectRatio className="text-on-surface-variant mr-sm text-xl" />;
    case "memory":
      return <MdMemory className="text-on-surface-variant mr-sm text-xl" />;
    case "verified":
      return <MdVerified className="text-on-surface-variant mr-sm text-xl" />;
    default:
      return <HiCheckCircle className="text-on-surface-variant mr-sm text-xl" />;
  }
};

interface ProductInfoProps {
  title: string;
  model: string;
  origin: string;
  price: { fob: string; unit: string; moq: string };
  tags: string[];
  keySpecs: { icon: string; label: string; value: string }[];
}

export default function ProductInfo({ title, model, origin, price, tags, keySpecs }: ProductInfoProps) {
  return (
    <div className="lg:col-span-5 flex flex-col">
      <div className="mb-md">
        <div className="flex items-center gap-sm mb-sm">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded font-label-sm text-label-sm ${tag.includes("Verified")
                ? "bg-tertiary-fixed-dim/20 text-on-tertiary-container"
                : "bg-secondary-container text-on-secondary-container"
                }`}
            >
              {tag.includes("Verified") && <MdVerified className="text-sm" />}
              {tag}
            </span>
          ))}
        </div>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
          {title}
        </h1>
        <p className="text-on-surface-variant font-body-sm text-body-sm">
          Model: {model} | Origin: {origin}
        </p>
      </div>

      <div className="bg-surface-container-high p-md rounded-lg mb-lg">
        <div className="flex justify-between items-baseline border-b border-outline-variant pb-sm mb-sm">
          <span className="text-on-surface-variant font-body-sm">FOB Price Reference:</span>
          <span className="font-headline-md text-primary">
            {price.fob} <span className="text-body-sm font-normal text-on-surface-variant">{price.unit}</span>
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-on-surface-variant font-body-sm">MOQ (Minimum Order):</span>
          <span className="font-body-md text-on-surface font-medium">{price.moq}</span>
        </div>
      </div>

      <div className="mb-lg">
        <h3 className="font-label-md text-label-md text-on-surface mb-sm uppercase tracking-wider">
          Key Specifications
        </h3>
        <ul className="space-y-sm">
          {keySpecs.map((spec, idx) => (
            <li key={idx} className="flex items-center">
              {getIcon(spec.icon)}
              <div>
                <span className="font-medium text-on-surface text-sm">{spec.label}</span>
                <span className="text-on-surface-variant text-sm ml-1">{spec.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-lg border-t border-outline-variant flex gap-md">
        <button
          onClick={() => {
            const form = document.getElementById('inquiry-form');
            if (form) {
              const yOffset = -100;
              const y = form.getBoundingClientRect().top + window.scrollY + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
          className="w-full btn button-success flex gap-1 items-center"
        >
          <HiOutlinePaperAirplane className="rotate-45" />
          Send Inquiry
        </button>
      </div>
    </div>
  );
}
