import React from "react";
import { howItWorksData } from "../data/data";
import IntroText from "./IntroText";

export default function HowItWorks() {
  return (
    <section className="bg-surface-lowest w-full flex justify-center border-b border-outline-variant/10" id="how-it-works">
      <div className="w-full inner-wrap">
        <div className="w-full container mx-auto px-gutter sm:px-0">

          {/* Header */}
          <IntroText
            tagline="Methodology"
            title={howItWorksData.title}
            description={howItWorksData.description}
          />

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-[52px] left-0 w-full h-[2px] bg-outline-variant/20 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-lg relative z-10">
              {howItWorksData.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-surface p-md rounded-xl border border-outline-variant/20 shadow-sm text-center flex flex-col items-center transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
                >
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-headline-sm mb-sm border-4 border-surface shadow-sm">
                    {step.number}
                  </div>
                  <h3 className="text-headline-sm text-primary mb-xs">
                    {step.title}
                  </h3>
                  <p className="text-body-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
