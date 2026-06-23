"use client";

import React, { useState } from "react";
import { HiGlobe, HiShare } from "react-icons/hi";
import { footerData, navigationData } from "../data/data";
import { MdEmail } from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";

const iconMap: Record<string, React.ElementType> = {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  MdEmail,
};

export default function Footer({ settings }: { settings?: any }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();

      if (data.success) {
        setNewsletterSubscribed(true);
        setNewsletterEmail("");
        setTimeout(() => setNewsletterSubscribed(false), 5000); // Clear message after 5s
      } else {
        alert(data.error || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Newsletter error:", error);
      alert("Failed to subscribe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-surface-low border-t border-outline-variant/20 w-full py-16 flex flex-col items-center">
      <div className="container w-full px-gutter sm:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl mb-16">

          {/* Footer Content: 50% width on large screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">

            {/* Logo, text, social links */}
            <div className="col-span-1 flex flex-col gap-md">
              <a href="#" className="flex items-center gap-md">
                <img
                  src={settings?.siteLogo || navigationData.logo.src}
                  alt={settings?.title || navigationData.logo.alt}
                  className="h-10 w-10 rounded-md object-contain"
                />
                <span className="text-headline-sm font-bold text-primary tracking-tight">
                  {settings?.title || navigationData.brandName}
                </span>
              </a>
              <p className="text-body-sm text-text-secondary mt-sm mb-sm leading-relaxed whitespace-pre-wrap">
                {settings?.description || footerData.description}
              </p>
              <div className="flex gap-md flex-wrap">
                {settings?.socialIcons && settings.socialIcons.length > 0 ? (
                  settings.socialIcons.map((social: any, idx: number) => {
                    const IconComponent = iconMap[social.icon] || HiGlobe;
                    return (
                      <a key={idx} className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/20 flex items-center justify-center text-text-secondary hover:text-primary transition-colors hover:shadow-sm" href={social.url} target="_blank" rel="noopener noreferrer" title={social.platform}>
                        <IconComponent className="text-lg" />
                      </a>
                    );
                  })
                ) : (
                  <>
                    <a className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/20 flex items-center justify-center text-text-secondary hover:text-primary transition-colors hover:shadow-sm" href="#">
                      <HiGlobe className="text-lg" />
                    </a>
                    <a className="w-10 h-10 rounded-full bg-surface-container border border-outline-variant/20 flex items-center justify-center text-text-secondary hover:text-primary transition-colors hover:shadow-sm" href="#">
                      <HiShare className="text-lg" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Navigation links */}
            <div className="col-span-1 flex flex-col gap-sm">
              <h4 className="text-label-md font-bold text-primary mb-sm uppercase tracking-wider">
                Quick Links
              </h4>
              {navigationData.links.map((link, idx) => (
                <a key={idx} className="text-body-sm text-text-secondary hover:text-primary transition-colors w-fit" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>

          </div>

          {/* Newsletter: 50% width on large screens */}
          <div className="flex flex-col">
            <div className="bg-primary-container text-white p-xl rounded-2xl shadow-lg border border-outline-variant/10 flex flex-col gap-lg h-full">
              <div>
                <h4 className="text-headline-sm text-white font-semibold mb-sm">
                  {footerData.newsletter.title}
                </h4>
                <p className="text-body-sm text-white/80">
                  {footerData.newsletter.description}
                </p>
              </div>

              {newsletterSubscribed ? (
                <div className="bg-tertiary/20 border border-tertiary/30 px-lg py-3 rounded-lg text-white font-semibold text-center mt-auto">
                  Thank you! You have subscribed.
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-md mt-auto">
                  <input
                    required
                    className="w-full bg-surface text-text-primary border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-text-secondary/50 text-sm"
                    placeholder="Your business email"
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button
                    className="w-full bg-primary text-white hover:bg-primary/90 hover:shadow-md px-xl py-sm rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        <div className="pt-lg border-t border-outline-variant/20 flex justify-center items-center">
          <p className="text-body-sm text-text-secondary text-center">
            © {new Date().getFullYear()} {settings?.title || "BB Enterprise Global"}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
