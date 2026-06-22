"use client";

import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { navigationData } from "../data/data";

export default function Navbar({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${scrolled
        ? "bg-surface/95 backdrop-blur-md border-outline-variant/30 shadow-sm py-3"
        : "bg-surface border-outline-variant/10 py-4"
        }`}
    >
      <div className="container mx-auto px-gutter sm:px-0 flex justify-between items-center h-16">
        {/* Logo and Brand */}
        <a href="/" className="flex items-center gap-md group">
          <img
            src={settings?.siteLogo || navigationData.logo.src}
            alt={settings?.title || navigationData.logo.alt}
            className="h-10 w-10 rounded-md object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-headline-sm lg:text-headline-md font-bold text-primary tracking-tight transition-colors duration-300 group-hover:text-primary/80">
            {settings?.title || navigationData.brandName}
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-lg">
          {navigationData.links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-text-secondary hover:text-primary font-semibold text-label-md px-sm py-xs rounded-md hover:bg-surface-low transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-md">
          {/* CTA */}
          <a
            href={navigationData.cta.href}
            className="hidden xl:inline-flex btn button-primary"
          >
            {navigationData.cta.label}
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="xl:hidden p-2 text-primary hover:bg-surface-low rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Responsive slide-down with fade) */}
      <div
        className={`xl:hidden absolute top-full left-0 w-full bg-surface border-b border-outline-variant/20 shadow-md transition-all duration-300 ease-in-out ${isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="container mx-auto px-gutter sm:px-0 py-lg flex flex-col gap-md">
          {navigationData.links.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-text-secondary hover:text-primary font-semibold text-body-md py-sm border-b border-outline-variant/10 last:border-none hover:pl-2 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href={navigationData.cta.href}
            onClick={() => setIsOpen(false)}
            className="w-full btn button-primary text-center"
          >
            {navigationData.cta.label}
          </a>
        </div>
      </div>
    </header>
  );
}
