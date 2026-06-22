import React from "react";

interface IntroTextProps {
  tagline?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export default function IntroText({ tagline, title, description, align = "center", className = "mb-16" }: IntroTextProps) {
  const isLeft = align === "left";
  return (
    <div className={`${isLeft ? "text-left" : "text-center"} ${className}`}>
      {tagline && (
        <span className="text-label-sm font-semibold tracking-wider text-secondary uppercase">
          {tagline}
        </span>
      )}
      <h2 className="text-headline-lg text-primary mt-sm mb-xs">
        {title}
      </h2>
      {description && (
        <p className={`text-body-lg text-text-secondary ${isLeft ? "" : "max-w-2xl mx-auto"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
