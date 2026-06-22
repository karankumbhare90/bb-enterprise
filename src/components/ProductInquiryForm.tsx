"use client";

import React, { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import toast from "react-hot-toast";

interface ProductInquiryFormProps {
  productName: string;
}

export default function ProductInquiryForm({ productName }: ProductInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    quantity: "",
    unit: "Sets",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "INQUIRY",
          productName,
          ...formData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmitStatus("success");
        toast.success(`Inquiry for ${productName} submitted successfully!`);
        setFormData({
          name: "",
          company: "",
          email: "",
          quantity: "",
          unit: "Sets",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        toast.error(data.message || "Failed to submit inquiry.");
      }
    } catch (error) {
      console.error("Submission error", error);
      setSubmitStatus("error");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="inquiry-form" className="max-w-5xl mx-auto bg-surface rounded-xl border border-outline-variant p-xl shadow-sm mb-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-lg">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
            Inquiry for this Product
          </h2>
          <p className="text-on-surface-variant text-body-md">
            Connect directly with the supplier for specific pricing, customization, and shipping details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label htmlFor="name" className="block font-label-sm text-label-sm text-on-surface mb-xs">
                Contact Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="company" className="block font-label-sm text-label-sm text-on-surface mb-xs">
                Company Name *
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Acme Manufacturing Inc."
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:border-transparent transition-shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div>
              <label htmlFor="email" className="block font-label-sm text-label-sm text-on-surface mb-xs">
                Business Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="jane@acme.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block font-label-sm text-label-sm text-on-surface mb-xs">
                Estimated Quantity *
              </label>
              <div className="flex gap-sm">
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="1"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-2/3 bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:border-transparent transition-shadow"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-1/3 bg-surface-container-low border border-outline-variant rounded-lg px-sm py-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:border-transparent"
                >
                  <option value="Sets">Sets</option>
                  <option value="Units">Units</option>
                  <option value="Pieces">Pieces</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block font-label-sm text-label-sm text-on-surface mb-xs">
              Detailed Requirements *
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Please include destination port, specific technical requirements, or certification needs..."
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-sm text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-tertiary-fixed-dim focus:border-transparent transition-shadow"
            ></textarea>
          </div>

          <div className="flex justify-end pt-sm">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn button-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              {!isSubmitting && <HiOutlineArrowRight className="text-sm" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
