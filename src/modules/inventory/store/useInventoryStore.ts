import { create } from 'zustand';
import { InventoryItem } from '../types';
import { inventoryService } from '../services/inventoryService';

interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id' | 'status'>) => Promise<void>;
  updateStock: (id: string, newStock: number, minStock: number) => Promise<void>;
  updateItem: (id: string, item: Partial<Omit<InventoryItem, 'id' | 'status'>>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = await inventoryService.getItems();
      set({ items, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addItem: async (item) => {
    set({ loading: true, error: null });
    try {
      const newItem = await inventoryService.addItem(item);
      set({ items: [newItem, ...get().items], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateStock: async (id, newStock, minStock) => {
    try {
      const updatedItem = await inventoryService.updateStock(id, newStock, minStock);
      set({
        items: get().items.map((i) => (i.id === id ? updatedItem : i)),
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  updateItem: async (id, item) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await inventoryService.updateItem(id, item);
      set({
        items: get().items.map((i) => (i.id === id ? updatedItem : i)),
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      await inventoryService.deleteItem(id);
      set({ items: get().items.filter((i) => i.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
