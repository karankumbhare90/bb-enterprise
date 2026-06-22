"use client";

import React from "react";
import { MdInventory, MdLocalShipping, MdAnchor } from "react-icons/md";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "inventory_2":
      return <MdInventory className="text-primary text-xl" />;
    case "local_shipping":
      return <MdLocalShipping className="text-primary text-xl" />;
    case "anchor":
      return <MdAnchor className="text-primary text-xl" />;
    default:
      return null;
  }
};

interface ProductTabsProps {
  tabsData: {
    overview: string[];
    technicalParameters: { key: string; value: string }[];
    packaging: { icon: string; label: string; text: string }[];
  };
}

export default function ProductTabs({ tabsData }: ProductTabsProps) {
  return (
    <div className="mb-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Main Content Area */}
        <div className={`space-y-lg ${tabsData.packaging && tabsData.packaging.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="bg-surface rounded-xl border border-outline-variant p-lg shadow-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">
              Product Overview
            </h2>
            <div className="prose prose-slate max-w-none text-body-md text-on-surface-variant space-y-md">
              {tabsData.overview.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Technical Parameters Table */}
          {tabsData.technicalParameters && tabsData.technicalParameters.length > 0 && (
            <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-lg py-md border-b border-outline-variant">
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wide">
                  Technical Parameters
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <tbody className="text-body-sm text-on-surface-variant divide-y divide-outline-variant">
                    {tabsData.technicalParameters.map((param, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${idx % 2 === 0
                          ? "bg-surface hover:bg-surface-container-low"
                          : "bg-surface-container-lowest hover:bg-surface-container-low"
                          }`}
                      >
                        <th className="px-lg py-md font-medium text-on-surface w-1/3">
                          {param.key}
                        </th>
                        <td className="px-lg py-md">{param.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Packaging & Logistics */}
        {tabsData.packaging && tabsData.packaging.length > 0 && (
          <div className="lg:col-span-1 space-y-lg">
            <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant shadow-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                Packaging & Logistics
              </h3>
              <ul className="space-y-md text-body-sm text-on-surface-variant">
                {tabsData.packaging.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-sm">
                    {getIcon(item.icon)}
                    <div>
                      <strong className="text-on-surface block">{item.label}</strong>
                      {item.text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
