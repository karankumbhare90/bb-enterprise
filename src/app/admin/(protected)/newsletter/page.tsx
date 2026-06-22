"use client";

import React, { useState, useEffect } from "react";
import { MdDelete, MdEmail } from "react-icons/md";

interface Subscriber {
  _id: string;
  email: string;
  status: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/newsletter");
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subscriber?")) return;

    try {
      const res = await fetch(`/api/newsletter/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setSubscribers(subscribers.filter((s) => s._id !== id));
      } else {
        alert(data.error || "Failed to delete subscriber");
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      alert("An error occurred while deleting.");
    }
  };

  return (
    <div className="p-4 md:p-2xl max-w-9xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-xl gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs flex items-center gap-2">
            <MdEmail className="text-primary" />
            Newsletter Subscribers
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage your newsletter audience and subscriptions.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-surface-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-secondary font-body-lg">
              Loading subscribers...
            </div>
          ) : subscribers.length === 0 ? (
            <div className="p-12 text-center text-secondary font-body-lg">
              No newsletter subscribers yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-low border-b border-outline-variant/30">
                  <th className="font-label-md text-label-md text-on-surface-variant py-md px-lg font-semibold w-1/3">
                    Email Address
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant py-md px-lg font-semibold w-1/4 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant py-md px-lg font-semibold w-1/4 hidden md:table-cell">
                    Subscribed Date
                  </th>
                  <th className="font-label-md text-label-md text-on-surface-variant py-md px-lg font-semibold w-[100px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-colors group"
                  >
                    <td className="py-md px-lg">
                      <div className="font-body-md text-body-md font-semibold text-on-surface">
                        {sub.email}
                      </div>
                    </td>
                    <td className="py-md px-lg hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          sub.status === "Subscribed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-md px-lg hidden md:table-cell">
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-md px-lg">
                      <div className="flex justify-end items-center">
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-error hover:bg-error-container hover:text-on-error-container transition-colors"
                          title="Delete Subscriber"
                        >
                          <MdDelete className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
