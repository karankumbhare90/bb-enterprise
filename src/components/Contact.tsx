"use client";

import React, { useState } from "react";
import { HiLocationMarker, HiMail, HiPhone, HiBadgeCheck } from "react-icons/hi";
import { contactData } from "../data/data";

export interface ContactDetail {
  icon: string;
  title: string;
  text: string;
}

interface ContactProps {
  id?: string;
  tagline?: string;
  title?: string;
  description?: string;
  details?: ContactDetail[];
}

const renderContactIcon = (icon: string) => {
  switch (icon) {
    case "location":
      return <HiLocationMarker className="text-3xl text-white" />;
    case "mail":
      return <HiMail className="text-3xl text-white" />;
    case "phone":
      return <HiPhone className="text-3xl text-white" />;
    default:
      return <HiLocationMarker className="text-3xl text-white" />;
  }
};

export default function Contact({
  id = "contact",
  tagline = "Inquiry Hub",
  title = contactData.title,
  description = contactData.description,
  details = contactData.details,
}: ContactProps) {
  // Contact Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    category: "Industrial Products",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName && formData.email && formData.message) {
      setFormSubmitted(true);
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        category: "Industrial Products",
        message: "",
      });
      setTimeout(() => setFormSubmitted(false), 5000); // Clear message after 5s
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-surface w-full flex justify-center" id={id}>
      <div className="max-w-container-max w-full px-gutter">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl bg-surface-lowest rounded-2xl shadow-md border border-outline-variant/10 overflow-hidden">

          {/* Info panel */}
          <div className="lg:col-span-5 p-xl bg-primary text-white flex flex-col justify-center gap-xl">
            <div>
              <span className="text-label-sm font-semibold tracking-wider text-tertiary uppercase mb-sm">
                {tagline}
              </span>
              <h2 className="text-display-lg text-white mb-sm tracking-tight leading-tight">
                {title}
              </h2>
              <p className="text-body-md text-white/80 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-lg mt-md">
              {details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-md">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {renderContactIcon(detail.icon)}
                  </div>
                  <div>
                    <h4 className="text-headline-sm text-white font-semibold">
                      {detail.title}
                    </h4>
                    <p className="text-body-md text-white/95 mt-xs">
                      {detail.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className="lg:col-span-7 p-xl flex flex-col justify-center">
            {formSubmitted ? (
              <div className="bg-tertiary/10 border border-tertiary/20 p-xl rounded-xl text-center flex flex-col items-center gap-md">
                <HiBadgeCheck className="text-5xl text-tertiary" />
                <h3 className="text-headline-md text-primary font-semibold">
                  Inquiry Sent Successfully!
                </h3>
                <p className="text-body-md text-text-secondary max-w-sm">
                  Thank you for contacting BB Enterprise. A global sourcing specialist will review your requirements and reach out within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div>
                    <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="firstName">
                      First Name
                    </label>
                    <input
                      required
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="lastName">
                      Last Name
                    </label>
                    <input
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="email">
                    Business Email
                  </label>
                  <input
                    required
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="category">
                    Product Category of Interest
                  </label>
                  <select
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option>Industrial Products</option>
                    <option>Electronics</option>
                    <option>Consumer Goods</option>
                    <option>Home & Living</option>
                    <option>Fashion & Accessories</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="message">
                    Your Requirements
                  </label>
                  <textarea
                    required
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                    id="message"
                    rows={4}
                    placeholder="Please include product details, estimated ordering volume, and destination port..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  className="w-full button-primary py-3 rounded-lg font-semibold hover:shadow-md active:scale-[0.98] transition-all"
                  type="submit"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
