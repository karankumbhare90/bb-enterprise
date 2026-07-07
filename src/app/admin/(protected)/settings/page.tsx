"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  MdSettings,
  MdPeople,
  MdAdd,
  MdDelete,
  MdImage,
  MdCloudUpload,
  MdClose,
  MdEmail,
  MdVisibility,
  MdVisibilityOff
} from "react-icons/md";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok
} from "react-icons/fa";

const ICON_OPTIONS = [
  { name: "Facebook", component: FaFacebook, value: "FaFacebook" },
  { name: "Twitter", component: FaTwitter, value: "FaTwitter" },
  { name: "Instagram", component: FaInstagram, value: "FaInstagram" },
  { name: "LinkedIn", component: FaLinkedin, value: "FaLinkedin" },
  { name: "YouTube", component: FaYoutube, value: "FaYoutube" },
  { name: "TikTok", component: FaTiktok, value: "FaTiktok" },
  { name: "Email", component: MdEmail, value: "MdEmail" },
];

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"general" | "users" | "awards">("general");

  // --- General Settings State ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newLogo, setNewLogo] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMobile, setContactMobile] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [googleMapLink, setGoogleMapLink] = useState("");
  const [socialIcons, setSocialIcons] = useState<{ platform: string; url: string; icon: string }[]>([]);
  const [awards, setAwards] = useState<{ heading: string; description: string }[]>([]);

  // --- User Management State ---
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState("admin");

  // --- Fetch Settings ---
  const { data: settingsResponse, isLoading: loadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settingsResponse?.data) {
      const s = settingsResponse.data;
      setTitle(s.title || "");
      setMetaTitle(s.metaTitle || "");
      setMetaDescription(s.metaDescription || "");
      setDescription(s.description || "");
      setContactEmail(s.contactEmail || "");
      setContactMobile(s.contactMobile || "");
      setContactAddress(s.contactAddress || "");
      setGoogleMapLink(s.googleMapLink || "");
      setSocialIcons(s.socialIcons || []);
      setAwards(s.awards || []);
      if (s.siteLogo) setPreviewImage(s.siteLogo);
    }
  }, [settingsResponse]);

  // --- Fetch Users ---
  const { data: usersResponse, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      return res.json();
    },
  });

  const users = usersResponse?.data || [];

  // --- Settings Mutations ---
  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("description", description);
      formData.append("contactEmail", contactEmail);
      formData.append("contactMobile", contactMobile);
      formData.append("contactAddress", contactAddress);
      formData.append("googleMapLink", googleMapLink);
      formData.append("socialIcons", JSON.stringify(socialIcons));
      formData.append("awards", JSON.stringify(awards));
      if (newLogo) {
        formData.append("siteLogo", newLogo);
      }

      const res = await fetch("/api/settings", {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Settings saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save settings");
    },
  });

  // --- Users Mutations ---
  const createUserMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: userEmail, password: userPassword, role: userRole }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("User registered successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsUserModalOpen(false);
      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setUserRole("admin");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to register user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user");
    },
  });

  const resendEmailMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}/resend`, { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success("Verification email resent!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to resend email");
    },
  });

  // --- Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewLogo(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddSocialIcon = () => {
    setSocialIcons([...socialIcons, { platform: "New Link", url: "", icon: "FaFacebook" }]);
  };

  const handleSocialIconChange = (index: number, field: string, value: string) => {
    const updated = [...socialIcons];
    updated[index] = { ...updated[index], [field]: value };
    setSocialIcons(updated);
  };

  const handleRemoveSocialIcon = (index: number) => {
    setSocialIcons(socialIcons.filter((_, i) => i !== index));
  };

  const getIconComponent = (iconValue: string) => {
    const found = ICON_OPTIONS.find(opt => opt.value === iconValue);
    return found ? found.component : MdEmail;
  };

  const handleAddAward = () => {
    setAwards([...awards, { heading: "", description: "" }]);
  };

  const handleAwardChange = (index: number, field: string, value: string) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  };

  const handleRemoveAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 md:p-2xl max-w-9xl mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-primary">Settings</h1>
        <p className="font-body-md text-body-md text-secondary mt-1">Manage global site settings and administrator access.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant mb-lg">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-6 py-3 font-label-md flex items-center gap-2 border-b-2 transition-colors ${activeTab === "general" ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"}`}
        >
          <MdSettings className="text-[20px]" />
          General Settings
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-label-md flex items-center gap-2 border-b-2 transition-colors ${activeTab === "users" ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"}`}
        >
          <MdPeople className="text-[20px]" />
          User Management
        </button>
        <button
          onClick={() => setActiveTab("awards")}
          className={`px-6 py-3 font-label-md flex items-center gap-2 border-b-2 transition-colors ${activeTab === "awards" ? "border-primary text-primary" : "border-transparent text-secondary hover:text-on-surface"}`}
        >
          <MdAdd className="text-[20px]" />
          Awards
        </button>
      </div>

      {/* Tab Content: General Settings */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          {/* Logo Upload */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-outline-variant/40 rounded-xl p-lg shadow-sm">
              <h3 className="font-label-lg text-primary mb-md">Site Logo</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer min-h-[200px]"
              >
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                {previewImage ? (
                  <img src={previewImage} alt="Site Logo" className="max-h-[120px] object-contain mb-4" />
                ) : (
                  <MdCloudUpload className="text-[48px] text-secondary mb-3 opacity-50" />
                )}
                <p className="font-label-md text-primary">Click to upload logo</p>
                <p className="font-body-sm text-secondary mt-1">SVG, PNG, or JPG</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 flex flex-col gap-lg">
            <div className="bg-surface border border-outline-variant/40 rounded-xl p-lg shadow-sm flex flex-col gap-md">
              <h3 className="font-label-lg text-primary">SEO & Branding</h3>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Site Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., BB Enterprise"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Meta Title</label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={e => setMetaTitle(e.target.value)}
                  placeholder="Global Meta Title"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Meta Description</label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={e => setMetaDescription(e.target.value)}
                  placeholder="Global Meta Description for search engines"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Footer Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Short description to appear in the footer"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Contact Info Block */}
            <div className="bg-surface border border-outline-variant/40 rounded-xl p-lg shadow-sm flex flex-col gap-md">
              <h3 className="font-label-lg text-primary">Contact Info</h3>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Business Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="contact@bb-enterprise.com"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Mobile / Phone Number</label>
                <input
                  type="text"
                  value={contactMobile}
                  onChange={e => setContactMobile(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Physical Address</label>
                <textarea
                  rows={2}
                  value={contactAddress}
                  onChange={e => setContactAddress(e.target.value)}
                  placeholder="123 Business Avenue, Suite 100..."
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface">Google Maps Link</label>
                <input
                  type="url"
                  value={googleMapLink}
                  onChange={e => setGoogleMapLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>

            <div className="bg-surface border border-outline-variant/40 rounded-xl p-lg shadow-sm">
              <div className="flex justify-between items-center mb-md">
                <h3 className="font-label-lg text-primary">Social Icons</h3>
                <button
                  type="button"
                  onClick={handleAddSocialIcon}
                  className="px-3 py-1.5 text-sm bg-secondary-container text-on-secondary-container hover:bg-secondary-container-high rounded-md font-label-md flex items-center gap-1 transition-colors"
                >
                  <MdAdd /> Add Link
                </button>
              </div>

              {socialIcons.length === 0 ? (
                <p className="text-secondary text-sm italic">No social links added yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {socialIcons.map((social, idx) => {
                    const IconComp = getIconComponent(social.icon);
                    return (
                      <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-surface-container-lowest p-3 border border-outline-variant/30 rounded-lg">

                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-surface-container rounded-md text-primary">
                            <IconComp className="text-[20px]" />
                          </div>
                          <select
                            value={social.icon}
                            onChange={(e) => handleSocialIconChange(idx, "icon", e.target.value)}
                            className="bg-surface border border-outline-variant rounded-md px-2 py-2 font-body-sm focus:outline-none focus:border-primary"
                          >
                            {ICON_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.name}</option>
                            ))}
                          </select>
                        </div>

                        <input
                          type="text"
                          value={social.platform}
                          onChange={(e) => handleSocialIconChange(idx, "platform", e.target.value)}
                          placeholder="Platform (e.g., Facebook)"
                          className="flex-1 bg-surface border border-outline-variant rounded-md px-3 py-2 font-body-sm focus:outline-none focus:border-primary w-full sm:w-auto"
                        />
                        <input
                          type="url"
                          value={social.url}
                          onChange={(e) => handleSocialIconChange(idx, "url", e.target.value)}
                          placeholder="URL (https://...)"
                          className="flex-[2] bg-surface border border-outline-variant rounded-md px-3 py-2 font-body-sm focus:outline-none focus:border-primary w-full sm:w-auto"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocialIcon(idx)}
                          className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors"
                        >
                          <MdDelete className="text-[20px]" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => saveSettingsMutation.mutate()}
                disabled={saveSettingsMutation.isPending}
                className="px-8 py-3 bg-primary text-white rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: User Management */}
      {activeTab === "users" && (
        <div className="bg-surface border border-outline-variant/40 rounded-xl shadow-sm overflow-hidden">
          <div className="p-md border-b border-outline-variant/30 flex flex-wrap gap-5 justify-between items-center bg-surface-container-lowest">
            <div>
              <h3 className="font-headline-sm text-primary">Registered Users</h3>
              <p className="text-sm text-secondary">Manage admin and editor access to the dashboard.</p>
            </div>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="w-full md:w-auto btn button-primary flex items-center justify-center gap-2"
            >
              <MdAdd /> Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                  <th className="px-6 py-4 font-label-md text-primary">Name</th>
                  <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Email</th>
                  <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Role</th>
                  <th className="px-6 py-4 font-label-md text-primary">Status</th>
                  <th className="hidden xl:table-cell px-6 py-4 font-label-md text-primary">Joined</th>
                  <th className="px-6 py-4 font-label-md text-primary text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr><td colSpan={4} className="text-center py-8 text-secondary">Loading users...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-secondary">No users found.</td></tr>
                ) : (
                  users.map((user: any) => (
                    <tr key={user._id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                      <td className="px-6 py-4 font-body-md text-on-surface font-medium">{user.name}</td>
                      <td className="hidden xl:table-cell px-6 py-4 font-body-md text-secondary">{user.email}</td>
                      <td className="hidden xl:table-cell px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-label-md ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-label-md ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 font-body-md text-secondary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                        {!user.isVerified && (
                          <button
                            onClick={() => resendEmailMutation.mutate(user._id)}
                            className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="Resend Verification Email"
                          >
                            <MdEmail className="text-[20px]" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this user?")) {
                              deleteUserMutation.mutate(user._id);
                            }
                          }}
                          className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors"
                          title="Delete User"
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
      )}

      {/* Tab Content: Awards */}
      {activeTab === "awards" && (
        <div className="bg-surface border border-outline-variant/40 rounded-xl p-lg shadow-sm">
          <div className="flex justify-between items-center mb-md">
            <div>
              <h3 className="font-headline-sm text-primary">Awards & Recognitions</h3>
              <p className="text-sm text-secondary">Manage the awards displayed on your site.</p>
            </div>
            <button
              onClick={handleAddAward}
              className="px-4 py-2 bg-primary text-white rounded-lg font-label-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <MdAdd /> Add Award
            </button>
          </div>

          {awards.length === 0 ? (
            <div className="text-center py-8 text-secondary border-2 border-dashed border-outline-variant rounded-xl">
              <p>No awards added yet. Click "Add Award" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {awards.map((award, index) => (
                <div key={index} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md flex flex-col gap-4 relative shadow-sm">
                  <button
                    onClick={() => handleRemoveAward(index)}
                    className="absolute top-2 right-2 p-2 text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors"
                    title="Remove Award"
                  >
                    <MdDelete className="text-[20px]" />
                  </button>
                  <div className="flex flex-col gap-2 pt-4">
                    <label className="font-label-md text-on-surface">Award Heading</label>
                    <input
                      type="text"
                      value={award.heading}
                      onChange={e => handleAwardChange(index, "heading", e.target.value)}
                      placeholder="e.g. Best Enterprise Software 2026"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-on-surface">Description</label>
                    <textarea
                      rows={3}
                      value={award.description}
                      onChange={e => handleAwardChange(index, "description", e.target.value)}
                      placeholder="Short description of the award..."
                      className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-md focus:outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-lg pt-md border-t border-outline-variant/30">
            <button
              onClick={() => saveSettingsMutation.mutate()}
              disabled={saveSettingsMutation.isPending}
              className="px-8 py-3 bg-primary text-white rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {saveSettingsMutation.isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center">
              <h3 className="font-headline-sm text-primary">Add New User</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-secondary hover:text-primary">
                <MdClose className="text-[24px]" />
              </button>
            </div>

            <div className="p-lg flex flex-col gap-md bg-surface-container-lowest">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={userPassword}
                    onChange={e => setUserPassword(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 pr-10 focus:border-primary focus:outline-none"
                    placeholder="••••••••"
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
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface">Role</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
            </div>

            <div className="p-lg border-t border-outline-variant/30 flex justify-end gap-3 bg-surface">
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="px-5 py-2 rounded-lg text-secondary border border-outline-variant hover:border-primary transition-colors font-label-md"
              >
                Cancel
              </button>
              <button
                onClick={() => createUserMutation.mutate()}
                disabled={createUserMutation.isPending || !userName || !userEmail || !userPassword}
                className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors font-label-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createUserMutation.isPending ? "Registering..." : "Register User"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
