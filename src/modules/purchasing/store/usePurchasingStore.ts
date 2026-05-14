import { create } from 'zustand';
import { purchasingService, PurchaseOrder } from '../services/purchasingService';

interface PurchasingState {
  purchaseOrders: PurchaseOrder[];
  suppliers: any[];
  loading: boolean;
  error: string | null;
  fetchPurchaseOrders: () => Promise<void>;
  fetchSuppliers: () => Promise<void>;
  createPO: (po: Omit<PurchaseOrder, 'id' | 'po_number' | 'status' | 'order_date'>) => Promise<void>;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => Promise<void>;
}

export const usePurchasingStore = create<PurchasingState>((set, get) => ({
  purchaseOrders: [],
  suppliers: [],
  loading: false,
  error: null,

  fetchPurchaseOrders: async () => {
    set({ loading: true, error: null });
    try {
      const purchaseOrders = await purchasingService.getPurchaseOrders();
      set({ purchaseOrders, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createPO: async (po) => {
    set({ loading: true, error: null });
    try {
      const newPO = await purchasingService.createPO(po);
      set({ purchaseOrders: [newPO, ...get().purchaseOrders], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updatePOStatus: async (id, status) => {
    try {
      await purchasingService.updatePOStatus(id, status);
      const orders = get().purchaseOrders.map(o => o.id === id ? { ...o, status } : o);
      set({ purchaseOrders: orders });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchSuppliers: async () => {
    try {
      const suppliers = await purchasingService.getSuppliers();
      set({ suppliers });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));
