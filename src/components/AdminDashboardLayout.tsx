"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { MdSearch, MdOpenInNew, MdNotifications, MdAccountCircle, MdMenu } from "react-icons/md";
import Link from "next/link";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 w-full md:w-[calc(100%-16rem)] h-screen overflow-hidden">
        {/* TopAppBar */}
        <header className="bg-surface border-b-2 border-surface-container-highest sticky top-0 z-10 w-full h-20 px-4 md:px-2xl flex items-center transition-all duration-200 ease-out gap-4">
          <button 
            className="md:hidden p-2 text-secondary hover:text-primary rounded-full hover:bg-surface-container-low transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <MdMenu className="text-[24px]" />
          </button>
          <div className="font-headline-sm text-headline-sm font-bold text-primary">ExportHub Admin</div>
        </header>

        {/* Main Canvas */}
        <main className="flex-1 overflow-y-auto bg-surface relative">
          {children}
        </main>
      </div>
    </div>
  );
}
