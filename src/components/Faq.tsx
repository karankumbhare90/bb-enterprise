import React from "react";
import { HiChevronDown } from "react-icons/hi";
import IntroText from "./IntroText";
import { faqsData } from "../data/data";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  id?: string;
  tagline?: string;
  title?: string;
  description?: string;
  items?: FaqItem[];
}

export default function Faq({
  id = "faq",
  tagline = "Knowledge Base",
  title = faqsData.title,
  description = faqsData.description,
  items = faqsData.items,
}: FaqProps) {
  return (
    <section className="py-20 lg:py-28 bg-surface-low/50 w-full flex justify-center border-t border-b border-outline-variant/10" id={id}>
      <div className="max-w-container-max w-full px-gutter">
        <IntroText
          tagline={tagline}
          title={title}
          description={description}
        />

        <div className="max-w-3xl mx-auto flex flex-col gap-sm">
          {items.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-surface rounded-xl border border-outline-variant/20 shadow-sm [&_summary::-webkit-details-marker]:hidden transition-all duration-300"
            >
              <summary className="flex items-center justify-between cursor-pointer p-lg font-semibold text-headline-sm text-primary select-none outline-none">
                <span>{faq.question}</span>
                <HiChevronDown className="transition-transform duration-300 group-open:rotate-180 text-xl text-primary" />
              </summary>
              <div className="p-lg pt-0 text-text-secondary font-body-md border-t border-outline-variant/10 mt-xs leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
