"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MdAdd,
  MdArrowDropDown,
  MdClose,
  MdChevronLeft,
  MdChevronRight,
  MdEdit,
  MdDelete,
  MdImage,
  MdExpandMore,
  MdAddPhotoAlternate,
  MdCloudUpload,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatListBulleted,
  MdFormatListNumbered
} from "react-icons/md";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter States
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Export" | "Import">("Export");

  // Form States
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("Active");
  const [tradeType, setTradeType] = useState<"Export" | "Import">("Export");
  const [description, setDescription] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [unit, setUnit] = useState("Units");

  const [techParams, setTechParams] = useState([{ name: "", value: "", icon: "" }]);
  const [packagingParams, setPackagingParams] = useState([{ name: "", value: "", icon: "" }]);

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const addForCat = params.get("addForCategory");
          if (addForCat) {
            setEditingId(null);
            setName("");
            setCategoryId(addForCat);
            setStatus("Active");
            setDescription("");
            setMinPrice("");
            setMaxPrice("");
            setMoq("1");
            setUnit("Units");
            setTechParams([]);
            setPackagingParams([]);
            setExistingImages([]);
            setNewImages([]);
            setIsEditPanelOpen(true);

            // Remove the query param from URL
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTechParam = () => setTechParams([...techParams, { name: "", value: "", icon: "" }]);
  const handleRemoveTechParam = (idx: number) => setTechParams(techParams.filter((_, i) => i !== idx));
  const handleTechParamChange = (idx: number, field: 'name' | 'value' | 'icon', val: string) => {
    const newParams = [...techParams];
    newParams[idx][field] = val;
    setTechParams(newParams);
  };

  const handleAddPackParam = () => setPackagingParams([...packagingParams, { name: "", value: "", icon: "" }]);
  const handleRemovePackParam = (idx: number) => setPackagingParams(packagingParams.filter((_, i) => i !== idx));
  const handlePackParamChange = (idx: number, field: 'name' | 'value' | 'icon', val: string) => {
    const newParams = [...packagingParams];
    newParams[idx][field] = val;
    setPackagingParams(newParams);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setName("");
    setCategoryId(categories.length > 0 ? categories[0]._id : "");
    setStatus("Active");
    setTradeType(activeTab);
    setDescription("");
    setMinPrice("");
    setMaxPrice("");
    setMoq("1");
    setUnit("Units");
    setTechParams([]);
    setPackagingParams([]);
    setExistingImages([]);
    setNewImages([]);
    setIsEditPanelOpen(true);
  };

  const handleEditClick = (product: any) => {
    setEditingId(product._id);
    setName(product.name || "");
    setCategoryId(product.category?._id || product.category || "");
    setStatus(product.status || "Active");
    setTradeType(product.tradeType || "Export");
    setDescription(product.description || "");
    setMinPrice(product.minPrice?.toString() || "");
    setMaxPrice(product.maxPrice?.toString() || "");
    setMoq(product.moq?.toString() || "");
    setUnit(product.unit || "Units");
    setTechParams(product.technicalParameters?.length ? product.technicalParameters : []);
    setPackagingParams(product.packagingLogistics?.length ? product.packagingLogistics : []);
    setExistingImages(product.images || []);
    setNewImages([]);
    setIsEditPanelOpen(true);
  };

  const closeEditPanel = () => {
    setIsEditPanelOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchProducts();
          if (isEditPanelOpen) closeEditPanel();
        } else {
          alert("Failed to delete product");
        }
      } catch (e) {
        console.error(e);
        alert("An error occurred while deleting.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setNewImages([...newImages, ...filesArray]);
    }
    // reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveExistingImage = (idx: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx: number) => {
    setNewImages(newImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!name || !categoryId) {
      alert("Name and Category are required");
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", categoryId);
      formData.append("status", status);
      formData.append("tradeType", tradeType);
      formData.append("description", description);
      formData.append("minPrice", minPrice);
      formData.append("maxPrice", maxPrice);
      formData.append("moq", moq);
      formData.append("unit", unit);

      formData.append("technicalParameters", JSON.stringify(techParams.filter(p => p.name && p.value)));
      formData.append("packagingLogistics", JSON.stringify(packagingParams.filter(p => p.name && p.value)));

      newImages.forEach(file => {
        formData.append("images", file);
      });

      if (editingId) {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setIsEditPanelOpen(false);
        fetchProducts();
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p => {
    let match = true;
    const pType = p.tradeType || "Export";
    if (pType !== activeTab) match = false;
    if (filterCategory && p.category?._id !== filterCategory) match = false;
    if (filterStatus && p.status !== filterStatus) match = false;
    return match;
  });

  return (
    <div className="p-4 md:p-2xl max-w-9xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-xl gap-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Import / Export Products</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage your import and export catalog, pricing, and minimum order quantities.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full md:w-auto btn button-primary flex items-center gap-2 justify-center"
        >
          <MdAdd className="text-[20px]" />
          Add {activeTab} Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-outline-variant/30 mb-md">
        <button
          onClick={() => setActiveTab("Export")}
          className={`pb-2 font-label-lg px-2 transition-colors ${activeTab === "Export" ? "border-b-2 border-primary text-primary" : "text-secondary hover:text-on-surface"}`}
        >
          Export List
        </button>
        <button
          onClick={() => setActiveTab("Import")}
          className={`pb-2 font-label-lg px-2 transition-colors ${activeTab === "Import" ? "border-b-2 border-primary text-primary" : "text-secondary hover:text-on-surface"}`}
        >
          Import List
        </button>
      </div>

      {/* Filters & Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-container-highest overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-md border-b border-surface-container-highest bg-surface-container-low flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <div className="flex gap-sm">
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="appearance-none px-md py-xs pl-3 pr-8 rounded-full border border-outline-variant bg-white text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high transition-colors focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              <MdArrowDropDown className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none px-md py-xs pl-3 pr-8 rounded-full border border-outline-variant bg-white text-on-surface-variant font-label-sm text-label-sm hover:bg-surface-container-high transition-colors focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Hidden">Hidden</option>
              </select>
              <MdArrowDropDown className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-secondary pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-md text-on-surface-variant font-body-sm text-body-sm">
            <span>Showing {filteredProducts.length > 0 ? 1 : 0}-{filteredProducts.length} of {filteredProducts.length}</span>
            <div className="flex gap-xs">
              <button className="p-xs rounded hover:bg-surface-container-high text-secondary disabled:opacity-50">
                <MdChevronLeft className="text-[20px]" />
              </button>
              <button className="p-xs rounded hover:bg-surface-container-high text-secondary">
                <MdChevronRight className="text-[20px]" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-md py-sm font-label-md text-label-md text-primary border-b-2 border-primary-fixed-dim bg-surface-container-low whitespace-nowrap w-24">Image</th>
                <th className="px-md py-sm font-label-md text-label-md text-primary border-b-2 border-primary-fixed-dim bg-surface-container-low whitespace-nowrap">Product Name</th>
                <th className="hidden xl:table-cell px-md py-sm font-label-md text-label-md text-primary border-b-2 border-primary-fixed-dim bg-surface-container-low whitespace-nowrap">Category</th>
                <th className="hidden xl:table-cell px-md py-sm font-label-md text-label-md text-primary border-b-2 border-primary-fixed-dim bg-surface-container-low whitespace-nowrap">Price (USD)</th>
                <th className="hidden xl:table-cell px-md py-sm font-label-md text-label-md text-primary border-b-2 border-primary-fixed-dim bg-surface-container-low whitespace-nowrap">MOQ</th>
                <th className="px-md py-sm font-label-md text-label-md text-primary border-b-2 border-primary-fixed-dim bg-surface-container-low whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-on-surface-variant">No products found.</td>
                </tr>
              ) : filteredProducts.map((product, idx) => (
                <tr
                  key={product._id}
                  className={`border-b border-surface-container-highest hover:bg-surface-bright transition-colors group ${idx % 2 === 1 ? 'bg-surface-container-lowest' : ''}`}
                >
                  <td className="px-md py-sm">
                    <div className="w-12 h-12 rounded bg-surface-container border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center text-outline">
                      {product.images && product.images.length > 0 ? (
                        <img alt={product.name} src={product.images[0].url} className="w-full h-full object-cover" />
                      ) : (
                        <MdImage className="text-[24px]" />
                      )}
                    </div>
                  </td>
                  <td className="px-md py-sm font-medium">{product.name}</td>
                  <td className="hidden xl:table-cell px-md py-sm text-on-surface-variant">{product.category?.name || '-'}</td>
                  <td className="hidden xl:table-cell px-md py-sm">${product.minPrice} - ${product.maxPrice}</td>
                  <td className="hidden xl:table-cell px-md py-sm">{product.moq} {product.unit}</td>
                  <td className="px-md py-sm text-right">
                    <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(product)}
                        className="p-xs text-secondary hover:text-primary transition-colors rounded hover:bg-surface-container"
                        title="Edit"
                      >
                        <MdEdit className="text-[20px]" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-xs text-secondary hover:text-error transition-colors rounded hover:bg-error-container"
                        title="Delete"
                      >
                        <MdDelete className="text-[20px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Screen Modal for Add/Edit Product */}
      {isEditPanelOpen && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center py-lg border-b border-outline-variant/30 bg-surface-container-lowest shadow-sm z-10">
            <div className="container mx-auto px-gutter sm:px-0 flex justify-between items-center">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="font-body-sm text-body-sm text-secondary mt-xs">
                  Update sourcing details, pricing, and media.
                </p>
              </div>
              <div className="flex items-center gap-lg">
                {editingId && (
                  <button
                    onClick={() => handleDelete(editingId)}
                    className="px-4 py-2 font-label-md text-label-md text-error bg-error/10 hover:bg-error/20 rounded-md transition-colors flex items-center gap-2"
                  >
                    <MdDelete className="text-[18px]" /> Delete
                  </button>
                )}
                <button
                  onClick={closeEditPanel}
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

              {/* Left Column: Details & Pricing */}
              <div className="lg:col-span-2 flex flex-col gap-lg">

                {/* Details Form */}
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
                  <h3 className="font-label-lg text-label-lg text-primary">Basic Information</h3>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Product Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Heavy Duty Conveyor Belt"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Category</label>
                      <div className="relative">
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        >
                          <option value="" disabled>Select Category</option>
                          {categories.map((cat: any) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                        <MdExpandMore className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none text-[20px]" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Trade Type</label>
                      <select
                        value={tradeType}
                        onChange={(e) => setTradeType(e.target.value as "Export" | "Import")}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      >
                        <option value="Export">Export</option>
                        <option value="Import">Import</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-3 font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Description</label>
                    <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <div className="bg-surface-container-low border-b border-outline-variant flex items-center p-1 gap-1">
                        <button className="p-1.5 hover:bg-surface-container rounded text-secondary hover:text-primary transition-colors"><MdFormatBold className="text-[18px]" /></button>
                        <button className="p-1.5 hover:bg-surface-container rounded text-secondary hover:text-primary transition-colors"><MdFormatItalic className="text-[18px]" /></button>
                        <button className="p-1.5 hover:bg-surface-container rounded text-secondary hover:text-primary transition-colors"><MdFormatUnderlined className="text-[18px]" /></button>
                        <div className="w-px h-4 bg-outline-variant mx-1"></div>
                        <button className="p-1.5 hover:bg-surface-container rounded text-secondary hover:text-primary transition-colors"><MdFormatListBulleted className="text-[18px]" /></button>
                        <button className="p-1.5 hover:bg-surface-container rounded text-secondary hover:text-primary transition-colors"><MdFormatListNumbered className="text-[18px]" /></button>
                      </div>
                      <textarea
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 font-body-md text-body-md focus:outline-none resize-none placeholder:text-outline bg-transparent"
                        placeholder="Detailed product description..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Pricing & Logistics */}
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
                  <h3 className="font-label-lg text-label-lg text-primary">Pricing & Logistics</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Min Price (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-body-md">$</span>
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-label-md text-on-surface">Max Price (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-body-md">$</span>
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-label-md text-on-surface">Minimum Order Quantity (MOQ)</label>
                    <div className="flex gap-4">
                      <input
                        type="number"
                        value={moq}
                        onChange={(e) => setMoq(e.target.value)}
                        placeholder="e.g. 100"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-48 px-4 py-3 bg-surface border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      >
                        <option value="Units">Units</option>
                        <option value="Pallets">Pallets</option>
                        <option value="Tons">Tons</option>
                        <option value="Kg">Kg</option>
                        <option value="Pieces">Pieces</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Technical Parameters */}
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
                    <h3 className="font-label-lg text-label-lg text-primary">Technical Parameters</h3>
                    <button
                      onClick={handleAddTechParam}
                      className="text-on-tertiary-container hover:text-tertiary-fixed-dim bg-secondary-container/30 hover:bg-secondary-container px-3 py-1.5 rounded-md font-label-md text-sm transition-colors flex items-center gap-1"
                    >
                      <MdAdd className="text-[18px]" /> Add Parameter
                    </button>
                  </div>

                  <div className="flex flex-col gap-sm">
                    {techParams.map((param, i) => (
                      <div key={i} className="flex gap-sm items-start group">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-sm">
                          <select
                            value={param.icon || ""}
                            onChange={(e) => handleTechParamChange(i, 'icon', e.target.value)}
                            className="col-span-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-all"
                          >
                            <option value="">No Icon</option>
                            <option value="MdSettings">Settings</option>
                            <option value="MdBuild">Build/Tools</option>
                            <option value="MdElectricBolt">Power/Electric</option>
                            <option value="MdScale">Weight</option>
                            <option value="MdStraighten">Dimensions</option>
                            <option value="MdLocalShipping">Shipping</option>
                            <option value="MdInventory">Box/Inventory</option>
                            <option value="MdTimer">Time/Speed</option>
                            <option value="MdSecurity">Security/Shield</option>
                            <option value="MdAcUnit">Cooling</option>
                            <option value="MdWaterDrop">Liquid</option>
                            <option value="MdThermostat">Temperature</option>
                            <option value="MdMemory">Chip/Processor</option>
                          </select>
                          <input
                            placeholder="Label (e.g. Spindle Motor)"
                            value={param.name}
                            onChange={(e) => handleTechParamChange(i, 'name', e.target.value)}
                            className="col-span-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-all"
                          />
                          <input
                            placeholder="Value (e.g. 11 kW)"
                            value={param.value}
                            onChange={(e) => handleTechParamChange(i, 'value', e.target.value)}
                            className="col-span-1 md:col-span-2 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveTechParam(i)}
                          className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remove Parameter"
                        >
                          <MdDelete className="text-[20px]" />
                        </button>
                      </div>
                    ))}
                    {techParams.length === 0 && (
                      <p className="text-sm text-secondary italic">No technical parameters added yet.</p>
                    )}
                  </div>
                </div>

                {/* Packaging & Logistics Details */}
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-lg">
                  <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
                    <h3 className="font-label-lg text-label-lg text-primary">Packaging & Logistics</h3>
                    <button
                      onClick={handleAddPackParam}
                      className="text-on-tertiary-container hover:text-tertiary-fixed-dim bg-secondary-container/30 hover:bg-secondary-container px-3 py-1.5 rounded-md font-label-md text-sm transition-colors flex items-center gap-1"
                    >
                      <MdAdd className="text-[18px]" /> Add Detail
                    </button>
                  </div>

                  <div className="flex flex-col gap-sm">
                    {packagingParams.map((param, i) => (
                      <div key={i} className="flex gap-sm items-start group">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-sm">
                          <select
                            value={param.icon || ""}
                            onChange={(e) => handlePackParamChange(i, 'icon', e.target.value)}
                            className="col-span-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-all"
                          >
                            <option value="">No Icon</option>
                            <option value="MdLocalShipping">Truck/Shipping</option>
                            <option value="MdInventory">Box/Package</option>
                            <option value="MdTimer">Time/Duration</option>
                            <option value="MdScale">Weight</option>
                            <option value="MdStraighten">Dimensions</option>
                            <option value="MdPublic">Global/Globe</option>
                            <option value="MdDescription">Document/Paper</option>
                            <option value="MdGavel">Legal/Customs</option>
                            <option value="MdVerified">Verified/Secure</option>
                          </select>
                          <input
                            placeholder="Label (e.g. Lead Time)"
                            value={param.name}
                            onChange={(e) => handlePackParamChange(i, 'name', e.target.value)}
                            className="col-span-1 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-all"
                          />
                          <input
                            placeholder="Value (e.g. Estimated 30-45 days)"
                            value={param.value}
                            onChange={(e) => handlePackParamChange(i, 'value', e.target.value)}
                            className="col-span-1 md:col-span-2 bg-surface border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                        <button
                          onClick={() => handleRemovePackParam(i)}
                          className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remove Detail"
                        >
                          <MdDelete className="text-[20px]" />
                        </button>
                      </div>
                    ))}
                    {packagingParams.length === 0 && (
                      <p className="text-sm text-secondary italic">No packaging details added yet.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Media Gallery */}
              <div className="flex flex-col gap-lg">
                <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 h-full flex flex-col">
                  <div className="flex justify-between items-center mb-md border-b border-outline-variant/30 pb-md">
                    <div>
                      <h3 className="font-label-lg text-label-lg text-primary">Media Gallery</h3>
                      <p className="text-sm text-secondary mt-1">Product images and documents.</p>
                      <p className="text-xs text-secondary mt-1 font-medium bg-surface-container inline-block px-2 py-1 rounded">Recommended size: 800x800px (1:1 ratio), Max: 2MB</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-on-tertiary-container hover:text-tertiary-fixed-dim bg-secondary-container/30 hover:bg-secondary-container px-3 py-2 rounded-md font-label-md text-sm transition-colors flex items-center gap-1"
                    >
                      <MdAddPhotoAlternate className="text-[18px]" /> Upload
                    </button>
                  </div>

                  <div className="flex-1 flex flex-col gap-md">
                    {/* Existing Images Gallery */}
                    <p className="font-label-md text-label-md text-on-surface">Existing Images</p>
                    {existingImages.length === 0 && <p className="text-sm text-secondary italic">No existing images.</p>}
                    <div className="grid grid-cols-3 gap-sm mt-xs">
                      {existingImages.map((img: any, idx: number) => (
                        <div key={idx} className="aspect-square rounded border border-outline-variant bg-surface-container relative overflow-hidden group">
                          <img alt="existing" src={img.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => handleRemoveExistingImage(idx)}
                              className="text-white p-xs hover:bg-white/20 rounded"
                            >
                              <MdDelete className="text-[20px]" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* New Images Gallery */}
                    <div className="mt-md">
                      <p className="font-label-md text-label-md text-on-surface mb-2">New Images to Upload</p>
                      {newImages.length === 0 && <p className="text-sm text-secondary italic">No new images selected.</p>}
                      <div className="grid grid-cols-3 gap-sm">
                        {newImages.map((file, idx) => (
                          <div key={idx} className="aspect-square rounded border border-outline-variant bg-surface-container relative overflow-hidden group">
                            <img alt="new upload" src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => handleRemoveNewImage(idx)}
                                className="text-white p-xs hover:bg-white/20 rounded"
                              >
                                <MdDelete className="text-[20px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors flex flex-col items-center justify-center text-secondary hover:text-primary gap-xs"
                        >
                          <MdAddPhotoAlternate className="text-[24px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-2xl py-lg border-t border-outline-variant/30 bg-surface-container-lowest flex justify-end gap-md shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)] z-10">
            <button
              onClick={closeEditPanel}
              disabled={isSaving}
              className="px-6 py-2.5 font-label-md text-label-md text-secondary border border-outline-variant hover:border-primary hover:text-primary rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-8 py-2.5 font-label-md text-label-md bg-primary text-white rounded-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
