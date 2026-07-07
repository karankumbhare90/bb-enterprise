import React from "react";
import IntroText from "./IntroText";
import { MdEmojiEvents, MdOutlineDone } from "react-icons/md";

export interface AwardItem {
  heading: string;
  description?: string | null;
}

interface AwardsProps {
  id?: string;
  tagline?: string;
  title?: string;
  description?: string;
  items?: AwardItem[];
}

export default function Awards({
  id = "awards",
  tagline = "",
  title = "Certification",
  description = "",
  items = [],
}: AwardsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-surface w-full flex justify-center border-t border-outline-variant/10" id={id}>
      <div className="container w-full px-gutter">
        <IntroText
          tagline={tagline}
          title={title}
          description={description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg w-full">
          {items.map((award, idx) => (
            <div
              key={idx}
              className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-level-2 hover:border-primary/30 transition-all duration-300 relative overflow-hidden p-5 text-left flex items-center justify-start gap-4"
            >
              <div className="flex-shrink-0 text-xl">
                <MdOutlineDone />
              </div>
              <div className="flex flex-col items-start justify-start">
                <h3 className="font-headline-sm text-headline-sm text-primary mb-0 z-10">
                  {award.heading}
                </h3>
                {award.description && (
                  <p className="font-body-md text-text-secondary leading-relaxed z-10 mt-2">
                    {award.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
