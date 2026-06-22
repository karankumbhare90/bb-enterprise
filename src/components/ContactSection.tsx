"use client";

import React, { useState, useEffect } from "react";
import {
  HiBadgeCheck,
  HiLocationMarker,
  HiMail,
  HiPhone
} from "react-icons/hi";
import { contactData } from "../data/data";

export default function ContactSection({ settings }: { settings?: any }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    category: "Other",
    message: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success && json.data) {
          setCategories(json.data.filter((c: any) => c.status === "Active"));
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);
  const dynamicDetails = [];
  if (settings?.contactAddress) {
    dynamicDetails.push({ icon: "location", title: "Global Headquarters", text: settings.contactAddress, link: settings.googleMapLink || undefined });
  }
  if (settings?.contactMobile) {
    dynamicDetails.push({ icon: "phone", title: "24/7 Support Line", text: settings.contactMobile, link: `tel:${settings.contactMobile}` });
  }
  if (settings?.contactEmail) {
    dynamicDetails.push({ icon: "mail", title: "General Inquiries", text: settings.contactEmail, link: `mailto:${settings.contactEmail}` });
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required.";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Requirements are required.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setFormSubmitted(true);
          // Reset form
          setFormData(prev => ({
            ...prev,
            firstName: "",
            lastName: "",
            email: "",
            mobileNo: "",
            message: "",
          }));
          setTimeout(() => setFormSubmitted(false), 5000); // Clear message after 5s
        } else {
          setErrors({ submit: data.error || "Failed to submit. Please try again." });
        }
      } catch (error) {
        console.error("Submission error:", error);
        setErrors({ submit: "A network error occurred. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

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

  return (
    <section className="bg-surface w-full flex justify-center" id="contact">
      <div className="w-full inner-wrap">
        <div className="mx-auto container w-full px-gutter sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl bg-surface-lowest rounded-2xl shadow-md border border-outline-variant/10 overflow-hidden">

            {/* Info panel */}
            <div className="lg:col-span-5 p-xl bg-primary text-white flex flex-col justify-center gap-xl">
              <div>
                <span className="text-label-sm font-semibold tracking-wider text-tertiary uppercase mb-sm">
                  Inquiry Hub
                </span>
                <h2 className="text-display-lg text-white mb-sm tracking-tight leading-tight">
                  {contactData.title}
                </h2>
                <p className="text-body-md text-white/80 leading-relaxed">
                  {contactData.description}
                </p>
              </div>

              <div className="space-y-lg mt-md">
                {(Array.isArray(dynamicDetails) && dynamicDetails.length > 0 ? dynamicDetails : contactData.details).map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-md">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {renderContactIcon(detail.icon)}
                    </div>
                    <div>
                      <h4 className="text-headline-sm text-white font-semibold">
                        {detail.title}
                      </h4>
                      {detail.link ? (
                        <a href={detail.link} target="_blank" rel="noopener noreferrer" className="text-body-md text-white/95 mt-xs hover:underline inline-block break-all">
                          {detail.text}
                        </a>
                      ) : (
                        <p className="text-body-md text-white/95 mt-xs break-all">
                          {detail.text}
                        </p>
                      )}
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
                <form onSubmit={handleContactSubmit} className="space-y-md" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full bg-surface-low border rounded-md px-md py-sm focus:ring-2 outline-none transition-all ${errors.firstName
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-outline-variant/30 focus:ring-primary focus:border-primary"
                          }`}
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData({ ...formData, firstName: e.target.value });
                          if (errors.firstName) setErrors({ ...errors, firstName: "" });
                        }}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        className="w-full bg-surface-low border border-outline-variant/30 rounded-md px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="email">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full bg-surface-low border rounded-md px-md py-sm focus:ring-2 outline-none transition-all ${errors.email
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-outline-variant/30 focus:ring-primary focus:border-primary"
                          }`}
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="mobileNo">
                        Mobile No <span className="text-red-500">*</span>
                      </label>
                      <input
                        className={`w-full bg-surface-low border rounded-md px-md py-sm focus:ring-2 outline-none transition-all ${errors.mobileNo
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : "border-outline-variant/30 focus:ring-primary focus:border-primary"
                          }`}
                        id="mobileNo"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={formData.mobileNo}
                        onChange={(e) => {
                          setFormData({ ...formData, mobileNo: e.target.value });
                          if (errors.mobileNo) setErrors({ ...errors, mobileNo: "" });
                        }}
                      />
                      {errors.mobileNo && <p className="text-red-500 text-xs mt-1">{errors.mobileNo}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="category">
                      Product Category of Interest
                    </label>
                    <select
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-md px-md py-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {categories.length > 0 ? (
                        <>
                          {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                          <option value="Other">Other</option>
                        </>
                      ) : (
                        <>
                          <option>Industrial Products</option>
                          <option>Electronics</option>
                          <option>Consumer Goods</option>
                          <option>Home & Living</option>
                          <option>Fashion & Accessories</option>
                          <option>Other</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-label-md font-semibold text-primary mb-xs" htmlFor="message">
                      Your Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`w-full bg-surface-low border rounded-md px-md py-sm focus:ring-2 outline-none transition-all resize-none ${errors.message
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-outline-variant/30 focus:ring-primary focus:border-primary"
                        }`}
                      id="message"
                      rows={4}
                      placeholder="Please include product details, estimated ordering volume, and destination port..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: "" });
                      }}
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {errors.submit && <p className="text-red-500 text-sm font-medium text-center">{errors.submit}</p>}

                  <button
                    className="w-full button-primary py-3 rounded-md font-semibold hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      "Send Inquiry"
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
