import { create } from 'zustand';

interface CategoryState {
  isModalOpen: boolean;
  editingCategory: any | null;
  previewImage: string | null;
  setModalOpen: (isOpen: boolean) => void;
  openAddModal: () => void;
  openEditModal: (category: any) => void;
  setPreviewImage: (url: string | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  isModalOpen: false,
  editingCategory: null,
  previewImage: null,
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  openAddModal: () => set({ isModalOpen: true, editingCategory: null, previewImage: null }),
  openEditModal: (category) => set({ isModalOpen: true, editingCategory: category, previewImage: category.image || null }),
  setPreviewImage: (url) => set({ previewImage: url }),
}));
