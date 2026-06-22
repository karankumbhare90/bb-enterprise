"use client";

import React, { useState, useEffect, useRef } from "react";
import { statsData } from "../data/data";

interface CounterItemProps {
  value: string;
  label: string;
}

function CounterItem({ value, label }: CounterItemProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const numberMatch = value.match(/([\d.]+)/);
    const suffixMatch = value.match(/([^\d.]+)/);

    if (!numberMatch) return;

    const targetValue = parseFloat(numberMatch[0]);
    const suffix = suffixMatch ? suffixMatch[0] : "";

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          let start = 0;
          const duration = 2000; // 2 seconds animation duration
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Quadratic ease-out progress
            const easeProgress = progress * (2 - progress);
            const currentCount = easeProgress * targetValue;

            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(targetValue);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value]);

  const formatCount = () => {
    const numberMatch = value.match(/([\d.]+)/);
    const suffixMatch = value.match(/([^\d.]+)/);
    const suffix = suffixMatch ? suffixMatch[0] : "";

    if (numberMatch && numberMatch[0].includes(".")) {
      return count.toFixed(1) + suffix;
    }

    return Math.floor(count).toLocaleString() + suffix;
  };

  return (
    <div ref={elementRef} className="flex flex-col items-center p-sm">
      <div className="text-display-lg text-primary font-bold mb-xs min-w-[110px]">
        {formatCount()}
      </div>
      <div className="text-label-md font-semibold text-text-secondary uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function StatsCounter() {
  return (
    <section className="bg-surface w-full flex justify-center border-b border-outline-variant/20">
      <div className="w-full inner-wrap">
        <div className="w-full container mx-auto px-gutter sm:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            {statsData.map((stat, idx) => (
              <CounterItem key={idx} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
