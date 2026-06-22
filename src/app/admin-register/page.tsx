"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdAdminPanelSettings, MdMail, MdLock, MdArrowForward, MdPerson, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { registerUser } from "@/actions/authActions";
import { toast } from "react-hot-toast";

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await registerUser(null, formData);
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
        router.push("/admin/products");
      }
    });
  };

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md min-h-screen flex items-center justify-center p-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      <main className="w-full max-w-[440px] animate-entry">
        {/* Brand / Header Section */}
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-container text-on-primary-container mb-md shadow-level-2">
            <MdAdminPanelSettings className="text-[32px]" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">BB Enterprise Admin</h1>
          <p className="font-body-md text-body-md text-secondary">
            Create an administrator account.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-xl shadow-level-2 relative overflow-hidden">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-lg mt-sm">
            {/* Name Field */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="absolute left-sm top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-lg" />
                <input
                  autoComplete="name"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-xl pr-md py-sm font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-on-tertiary-container focus:border-transparent transition-all duration-200 ease-out"
                  id="name"
                  name="name"
                  placeholder="Admin User"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <MdMail className="absolute left-sm top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-lg" />
                <input
                  autoComplete="email"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-xl pr-md py-sm font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-on-tertiary-container focus:border-transparent transition-all duration-200 ease-out"
                  id="email"
                  name="email"
                  placeholder="admin@exporthub.com"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-sm">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-sm top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-lg" />
                <input
                  autoComplete="new-password"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-xl pr-10 py-sm font-body-md text-body-md text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-on-tertiary-container focus:border-transparent transition-all duration-200 ease-out"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={isPending}
              className="w-full btn button-primary flex items-center gap-2 justify-center mt-sm"
              type="submit"
            >
              {isPending ? "Please wait..." : "Register Account"}
              {!isPending && <MdArrowForward className="text-[18px]" />}
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-lg text-center border-t border-outline-variant/30 pt-md">
            <p className="font-body-sm text-body-sm text-secondary">
              Already have an account?{" "}
              <Link href="/admin/login" className="font-label-md text-label-md text-primary hover:underline transition-all">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-lg">
          <p className="font-body-sm text-body-sm text-secondary">
            Protected by <span className="font-label-md text-label-md text-primary">ExportHub Security</span>
          </p>
        </div>
      </main>
    </div>
  );
}
