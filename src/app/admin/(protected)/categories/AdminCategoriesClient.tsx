"use client";

import React, { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  MdAdd,
  MdMoreVert,
  MdInventory,
  MdEdit,
  MdArrowForward,
  MdImage,
  MdClose,
  MdCloudUpload,
  MdDelete
} from "react-icons/md";
import { toast } from "react-hot-toast";
import { useCategoryStore } from "@/store/categoryStore";

export default function AdminCategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter State
  const [filter, setFilter] = useState("All");

  // Modal State for Product Selection
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal State for Delete Confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Zustand Store
  const {
    isModalOpen,
    editingCategory,
    previewImage,
    openAddModal,
    openEditModal,
    setModalOpen,
    setPreviewImage,
  } = useCategoryStore();

  // React Query: Fetch Categories
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      return res.json();
    },
    initialData: { success: true, data: initialCategories },
  });

  const categories = categoriesResponse?.data || [];

  const filteredCategories = categories.filter((cat: any) => {
    if (filter === "All") return true;
    return cat.status === filter;
  });

  // React Query: Fetch Products
  const { data: productsResponse } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      return res.json();
    },
  });

  const allProducts = productsResponse?.data || [];

  // Calculate Associated Products for the currently editing category
  const associatedProducts = editingCategory
    ? allProducts.filter((p: any) => {
      const productCatId = p.category?._id || p.category;
      const currentCatId = editingCategory._id || editingCategory.id;
      return productCatId && currentCatId && productCatId.toString() === currentCatId.toString();
    })
    : [];

  // React Query: Create Category
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/categories", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create");
      return data;
    },
    onSuccess: () => {
      toast.success("Category created successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.refresh();
      setModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // React Query: Update Category
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await fetch(`/api/categories/${id}`, { method: "PUT", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update");
      return data;
    },
    onSuccess: () => {
      toast.success("Category updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.refresh();
      setModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  // React Query: Delete Category
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete");
      return data;
    },
    onSuccess: () => {
      toast.success("Category deleted!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.refresh();
      if (isModalOpen) setModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id || editingCategory.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openProductSelector = () => {
    const catId = editingCategory?._id || editingCategory?.id;
    if (!catId) {
      toast.error("Please save the category first before adding products.");
      return;
    }
    // Pre-fill selected products
    setSelectedProductIds(associatedProducts.map((p: any) => p._id));
    setIsProductModalOpen(true);
  };

  const handleAssignProducts = async () => {
    try {
      const catId = editingCategory?._id || editingCategory?.id;
      const res = await fetch(`/api/categories/${catId}/assign-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: selectedProductIds })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Products assigned successfully!");
        setIsProductModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(data.error || "Failed to assign products");
      }
    } catch (e: any) {
      toast.error("Error assigning products");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-4 md:p-2xl max-w-9xl mx-auto w-full animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Manage Categories</h1>
          <p className="font-body-md text-body-md text-secondary mt-1">Organize and structure your global product taxonomy.</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full md:w-auto btn button-primary flex items-center gap-2 justify-center"
        >
          <MdAdd className="text-[20px]" />
          Add New Category
        </button>
      </div>

      {/* Filters & Views Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-surface-container-low p-sm rounded-lg mb-lg border border-outline-variant/30 gap-md">
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setFilter("All")}
            className={`px-4 py-2 rounded-md font-label-md text-label-md flex-1 sm:flex-none transition-colors ${filter === "All" ? "bg-surface text-primary shadow-sm border border-outline-variant/50" : "text-secondary hover:bg-surface-container"}`}
          >
            All ({categories.length})
          </button>
          <button 
            onClick={() => setFilter("Active")}
            className={`px-4 py-2 rounded-md font-label-md text-label-md flex-1 sm:flex-none transition-colors ${filter === "Active" ? "bg-surface text-primary shadow-sm border border-outline-variant/50" : "text-secondary hover:bg-surface-container"}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter("Draft")}
            className={`px-4 py-2 rounded-md font-label-md text-label-md flex-1 sm:flex-none transition-colors ${filter === "Draft" ? "bg-surface text-primary shadow-sm border border-outline-variant/50" : "text-secondary hover:bg-surface-container"}`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-secondary">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredCategories.map((cat: any, idx: number) => (
            <div
              key={cat._id || cat.id}
              className={`bg-surface border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`h-60 w-full relative overflow-hidden ${cat.image ? 'bg-surface-container' : 'bg-surface-container-high flex items-center justify-center'}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                {cat.image ? (
                  <img alt={cat.name} src={cat.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <MdImage className="text-outline text-[48px] opacity-50 relative z-0" />
                )}
                <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                  <span className={`${cat.status === 'Active'
                    ? 'bg-surface-variant text-on-tertiary-fixed-variant border-tertiary-fixed-dim/30'
                    : 'bg-surface-variant text-on-surface-variant border-outline-variant/50'
                    } font-label-sm text-label-sm px-2 py-1 rounded backdrop-blur-sm border`}>
                    {cat.status || "Active"}
                  </span>
                </div>
              </div>

              <div className="p-lg flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-sm text-headline-sm text-primary">{cat.name}</h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(cat)} className="text-secondary hover:text-primary transition-colors p-1.5 rounded hover:bg-surface-container" title="Edit">
                      <MdEdit className="text-[20px]" />
                    </button>
                    <button onClick={() => confirmDelete(cat._id || cat.id)} className="text-secondary hover:text-error transition-colors p-1.5 rounded hover:bg-error/10" title="Delete">
                      <MdDelete className="text-[20px]" />
                    </button>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-secondary mb-4 line-clamp-2">{cat.description}</p>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <div className="col-span-full py-xl text-center text-secondary">
              No categories found matching your filter.
            </div>
          )}
        </div>
      )}

      {/* Full Screen Modal for Add/Edit Category */}
      {isModalOpen && (
        <form onSubmit={handleSubmit} className="fixed inset-0 z-[100] bg-surface flex flex-col animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center py-lg border-b border-outline-variant/30 bg-surface-container-lowest shadow-sm z-10">
            <div className="container mx-auto px-gutter sm:px-0 flex justify-between items-center">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <p className="font-body-sm text-body-sm text-secondary mt-xs">
                  Configure category details, images, and associated products.
                </p>
              </div>
              <div className="flex items-center gap-lg">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => confirmDelete(editingCategory._id || editingCategory.id)}
                    className="px-4 py-2 font-label-md text-label-md text-error bg-error/10 hover:bg-error/20 rounded-md transition-colors flex items-center gap-2"
                  >
                    <MdDelete className="text-[18px]" /> Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 text-secondary hover:text-primary rounded-full hover:bg-surface-container transition-colors bg-surface-container-low"
                >
                  <MdClose className="text-[24px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-surface-container-low/30">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 px-gutter gap-xl sm:px-0 py-10">

              {/* Left Column: Details & Image */}
              <div className="lg:col-span-2 flex flex-col gap-lg">

                {/* Category Image */}
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30">
                  <h3 className="font-label-lg text-label-lg text-primary mb-md">Card Image</h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group min-h-[200px] relative overflow-hidden"
                  >
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {previewImage ? (
                      <>
                        <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="h-12 w-12 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <MdImage className="text-[24px]" />
                          </div>
                          <p className="font-label-md text-label-md text-primary bg-surface-container-lowest px-3 py-1 rounded-md">Change Image</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 rounded-full bg-primary-fixed/30 text-primary-container flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <MdCloudUpload className="text-[24px]" />
                        </div>
                        <p className="font-label-md text-label-md text-primary mb-1">Click to upload category thumbnail</p>
                        <p className="font-body-sm text-body-sm text-secondary">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
                  <h3 className="font-label-lg text-label-lg text-primary">Category Details</h3>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Title</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingCategory?.name}
                      placeholder="e.g., Aerospace Components"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Description</label>
                    <textarea
                      rows={4}
                      name="description"
                      defaultValue={editingCategory?.description}
                      placeholder="Brief description of the category..."
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline resize-none"
                    ></textarea>
                  </div>

                  <div className="flex flex-col gap-2 mt-sm">
                    <label className="font-label-md text-label-md text-on-surface">Status</label>
                    <select
                      name="status"
                      defaultValue={editingCategory?.status || "Active"}
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-primary transition-all text-on-surface"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Right Column: Associated Products */}
              <div className="flex flex-col gap-lg">
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 h-full flex flex-col min-h-[400px]">
                  <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-md">
                    <div>
                      <h3 className="font-label-lg text-label-lg text-primary">Associated Products</h3>
                      <p className="text-sm text-secondary mt-1">Products featured in this category.</p>
                    </div>
                    <button
                      type="button"
                      onClick={openProductSelector}
                      className="text-on-tertiary-container hover:text-tertiary-fixed-dim bg-secondary-container/30 hover:bg-secondary-container px-3 py-2 rounded-md font-label-md text-sm transition-colors flex items-center gap-1"
                    >
                      <MdAdd className="text-[18px]" /> Add
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col gap-sm overflow-y-auto max-h-[400px]">
                    {associatedProducts.length === 0 ? (
                      <div className="flex-1 border-2 border-dashed border-outline-variant/50 rounded-lg bg-surface flex items-center justify-center flex-col text-secondary p-lg text-center h-[200px]">
                        <MdInventory className="text-[48px] opacity-20 mb-2" />
                        <p className="font-label-md">No products added</p>
                        <p className="font-body-sm text-xs mt-1">Click "Add" to select products for this category.</p>
                      </div>
                    ) : (
                      associatedProducts.map((p: any) => (
                        <div key={p._id} className="flex items-center gap-sm p-3 border border-outline-variant/30 rounded-lg bg-surface">
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-secondary">
                              <MdInventory />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-label-md text-on-surface truncate">{p.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newIds = associatedProducts.filter((ap: any) => ap._id !== p._id).map((ap: any) => ap._id);
                              fetch(`/api/categories/${editingCategory._id || editingCategory.id}/assign-products`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ productIds: newIds })
                              }).then(() => queryClient.invalidateQueries({ queryKey: ["products"] }));
                            }}
                            className="p-1.5 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <MdClose className="text-[18px]" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-2xl py-lg border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-md shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 font-label-md text-label-md text-secondary border border-outline-variant hover:border-primary hover:text-primary rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 font-label-md text-label-md bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm disabled:opacity-50"
            >
              {isPending ? "Saving..." : editingCategory ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-surface rounded-xl shadow-lg w-full max-w-md flex flex-col overflow-hidden">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
                <MdDelete className="text-error" /> Confirm Deletion
              </h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 text-secondary hover:text-primary rounded-full hover:bg-surface-container transition-colors">
                <MdClose className="text-[24px]" />
              </button>
            </div>

            <div className="p-lg bg-surface-container-lowest">
              <p className="font-body-md text-on-surface">
                Are you sure you want to delete this category? This action cannot be undone and will permanently remove the category data.
              </p>
            </div>

            <div className="p-lg border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-md">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-2.5 font-label-md text-secondary border border-outline-variant hover:border-primary hover:text-primary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeDelete}
                disabled={deleteMutation.isPending}
                className="px-8 py-2.5 font-label-md bg-red-500 text-white rounded-lg hover:bg-red-500/90 transition-all active:scale-95 shadow-sm disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center animate-fade-in p-4">
          <div className="bg-surface rounded-xl shadow-lg w-full max-w-2xl flex flex-col overflow-hidden max-h-[80vh]">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-headline-sm text-headline-sm text-primary">Select Products</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-secondary hover:text-primary rounded-full hover:bg-surface-container transition-colors">
                <MdClose className="text-[24px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-lg bg-surface-container-lowest flex flex-col gap-sm">
              {allProducts.length === 0 ? (
                <p className="text-secondary text-center py-4">No products available.</p>
              ) : (
                allProducts.map((p: any) => (
                  <label key={p._id} className="flex items-center gap-md p-3 border border-outline-variant/30 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-primary rounded border-outline-variant"
                      checked={selectedProductIds.includes(p._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProductIds([...selectedProductIds, p._id]);
                        } else {
                          setSelectedProductIds(selectedProductIds.filter(id => id !== p._id));
                        }
                      }}
                    />
                    {p.images && p.images.length > 0 ? (
                      <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-secondary">
                        <MdInventory />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-label-md text-on-surface">{p.name}</p>
                      <p className="font-body-sm text-secondary">${p.minPrice} - ${p.maxPrice}</p>
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="p-lg border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-md">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="px-6 py-2.5 font-label-md text-secondary border border-outline-variant hover:border-primary hover:text-primary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAssignProducts}
                className="px-8 py-2.5 font-label-md bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
