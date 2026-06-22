"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdInventory,
  MdCategory,
  MdSettings,
  MdContactMail,
  MdEmail,
  MdLogout,
  MdClose
} from "react-icons/md";
import { logoutUser } from "@/actions/authActions";

export default function AdminSidebar({ isOpen = false, onClose = () => {} }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    await logoutUser();
    onClose();
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={onClose}
        ></div>
      )}
      <nav className={`bg-surface-container-lowest shadow-sm h-screen w-64 fixed left-0 top-0 flex flex-col py-lg px-md border-r border-outline-variant z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center px-md">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary mb-xs">BB Enterprise</h1>
            <p className="font-body-sm text-body-sm text-secondary">Global Admin Panel</p>
          </div>
          <button 
            className="md:hidden p-1 text-secondary hover:text-primary rounded-full hover:bg-surface-container-low transition-colors"
            onClick={onClose}
          >
            <MdClose className="text-[24px]" />
          </button>
        </div>

      <div className="flex-1 flex flex-col gap-sm overflow-y-auto mt-xl">

        {/* Import/Export Tab */}
        <Link
          href="/admin/products"
          onClick={onClose}
          className={`flex items-center gap-md px-md py-sm rounded-sm font-label-md text-label-md transition-all duration-200 ease-out active:scale-95 ${isActive("/admin/products")
            ? "bg-secondary-container text-on-secondary-container font-bold"
            : "text-secondary hover:bg-surface-container-high"
            }`}
        >
          <MdInventory className="text-[20px]" />
          Import / Export
        </Link>

        {/* Categories Tab */}
        <Link
          href="/admin/categories"
          onClick={onClose}
          className={`flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-all duration-200 ease-out active:scale-95 ${isActive("/admin/categories")
            ? "bg-secondary-container text-on-secondary-container font-bold"
            : "text-secondary hover:bg-surface-container-high"
            }`}
        >
          <MdCategory className="text-[20px]" />
          Categories
        </Link>

        {/* Contacts Tab */}
        <Link
          href="/admin/contacts"
          onClick={onClose}
          className={`flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-all duration-200 ease-out active:scale-95 ${isActive("/admin/contacts")
            ? "bg-secondary-container text-on-secondary-container font-bold"
            : "text-secondary hover:bg-surface-container-high"
            }`}
        >
          <MdContactMail className="text-[20px]" />
          Contacts
        </Link>

        {/* Newsletter Tab */}
        <Link
          href="/admin/newsletter"
          onClick={onClose}
          className={`flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-all duration-200 ease-out active:scale-95 ${isActive("/admin/newsletter")
            ? "bg-secondary-container text-on-secondary-container font-bold"
            : "text-secondary hover:bg-surface-container-high"
            }`}
        >
          <MdEmail className="text-[20px]" />
          Newsletter
        </Link>

        <Link
          href="/admin/settings"
          onClick={onClose}
          className={`flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-all duration-200 ease-out active:scale-95 ${isActive("/admin/settings")
            ? "bg-secondary-container text-on-secondary-container font-bold"
            : "text-secondary hover:bg-surface-container-high"
            }`}
        >
          <MdSettings className="text-[20px]" />
          Settings
        </Link>
      </div>

      <div className="mt-auto flex flex-col gap-sm pt-md border-t border-outline-variant">
        <button
          onClick={handleLogout}
          className="flex items-center gap-md px-md py-sm text-secondary hover:bg-surface-container-high transition-colors rounded-lg font-label-md text-label-md w-full text-left"
        >
          <MdLogout className="text-[20px]" />
          Logout
        </button>
      </div>
    </nav>
    </>
  );
}
