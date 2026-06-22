"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { MdDelete, MdMail, MdClose } from "react-icons/md";

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Contact deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete contact");
    },
  });

  const contacts = response?.data || [];

  return (
    <div className="p-4 md:p-2xl max-w-9xl mx-auto w-full animate-fade-in">
      <div className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary">Inquiries</h1>
        <p className="font-body-md text-body-md text-secondary mt-1">
          Manage and view all incoming contact form submissions.
        </p>
      </div>

      <div className="bg-surface border border-outline-variant/40 rounded-xl shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/30 bg-surface-container-lowest">
          <h3 className="font-headline-sm text-primary">All Inquiries</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/30">
                <th className="px-6 py-4 font-label-md text-primary">Name</th>
                <th className="px-6 py-4 font-label-md text-primary">Email</th>
                <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Phone</th>
                <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Category</th>
                <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Message</th>
                <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Date</th>
                <th className="px-6 py-4 font-label-md text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-secondary">
                    Loading inquiries...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-secondary">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                contacts.map((contact: any) => (
                  <tr
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-body-md text-on-surface font-medium">
                      <div className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-none" title={`${contact.firstName} ${contact.lastName}`}>
                        {contact.firstName} {contact.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-md text-secondary">
                      <a href={`mailto:${contact.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 hover:text-primary transition-colors max-w-[150px] sm:max-w-[150px] md:max-w-none">
                        <MdMail className="flex-shrink-0" />
                        <span className="truncate" title={contact.email}>
                          {contact.email}
                        </span>
                      </a>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 font-body-md text-secondary">
                      {contact.mobileNo}
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-label-md bg-secondary-container text-on-secondary-container">
                        {contact.category}
                      </span>
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 font-body-md text-secondary max-w-xs truncate" title={contact.message}>
                      {contact.message}
                    </td>
                    <td className="hidden xl:table-cell px-6 py-4 font-body-md text-secondary whitespace-nowrap">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this inquiry?")) {
                            deleteContactMutation.mutate(contact._id);
                          }
                        }}
                        className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors inline-flex"
                        title="Delete Inquiry"
                      >
                        <MdDelete className="text-[20px]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-surface rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-outline-variant/20 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-xl border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest flex-shrink-0">
              <h3 className="font-headline-md text-primary">Inquiry Details</h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 text-secondary hover:text-primary hover:bg-surface-container-high rounded-full transition-colors"
              >
                <MdClose className="text-[24px]" />
              </button>
            </div>
            <div className="p-xl overflow-y-auto space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md bg-surface-container-lowest p-md rounded-xl border border-outline-variant/20">
                <div>
                  <span className="text-label-sm text-secondary uppercase block mb-xs">Name</span>
                  <p className="font-body-md text-primary font-medium">{selectedContact.firstName} {selectedContact.lastName}</p>
                </div>
                <div>
                  <span className="text-label-sm text-secondary uppercase block mb-xs">Email</span>
                  <a href={`mailto:${selectedContact.email}`} className="font-body-md text-primary font-medium hover:underline inline-flex items-center gap-1 break-all">
                    <MdMail className="text-[16px] flex-shrink-0" />
                    {selectedContact.email}
                  </a>
                </div>
                <div>
                  <span className="text-label-sm text-secondary uppercase block mb-xs">Phone</span>
                  <p className="font-body-md text-primary font-medium">{selectedContact.mobileNo}</p>
                </div>
                <div>
                  <span className="text-label-sm text-secondary uppercase block mb-xs">Date</span>
                  <p className="font-body-md text-primary font-medium">{new Date(selectedContact.createdAt).toLocaleString()}</p>
                </div>
                {selectedContact.category && (
                  <div className="sm:col-span-2">
                    <span className="text-label-sm text-secondary uppercase block mb-xs">Category</span>
                    <span className="px-2 py-1 rounded text-xs font-label-md bg-secondary-container text-on-secondary-container inline-block">
                      {selectedContact.category}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <span className="text-label-sm text-secondary uppercase block mb-sm">Message</span>
                <div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/20">
                  <p className="font-body-lg text-secondary whitespace-pre-wrap leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-lg border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-6 py-2 bg-primary text-white rounded-lg font-label-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
