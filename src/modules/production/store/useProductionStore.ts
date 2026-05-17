import { create } from 'zustand';
import { productionService, WorkOrder } from '../services/productionService';

interface ProductionState {
  workOrders: WorkOrder[];
  boms: any[];
  machines: any[];
  loading: boolean;
  error: string | null;
  fetchWorkOrders: () => Promise<void>;
  fetchBoms: () => Promise<void>;
  fetchMachines: () => Promise<void>;
  createWorkOrder: (wo: Omit<WorkOrder, 'id' | 'wo_number' | 'status' | 'produced_quantity'>) => Promise<void>;
  updateWOStatus: (id: string, status: WorkOrder['status']) => Promise<void>;
  deleteWorkOrder: (id: string) => Promise<void>;
}

export const useProductionStore = create<ProductionState>((set, get) => ({
  workOrders: [],
  boms: [],
  machines: [],
  loading: false,
  error: null,

  fetchWorkOrders: async () => {
    set({ loading: true, error: null });
    try {
      const workOrders = await productionService.getWorkOrders();
      set({ workOrders, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchBoms: async () => {
    try {
      const boms = await productionService.getBoms();
      set({ boms });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  fetchMachines: async () => {
    try {
      const machines = await productionService.getMachines();
      set({ machines });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  createWorkOrder: async (wo) => {
    set({ loading: true, error: null });
    try {
      const newWO = await productionService.createWorkOrder(wo);
      set({ workOrders: [newWO, ...get().workOrders], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateWOStatus: async (id, status) => {
    try {
      const updated = await productionService.updateWOStatus(id, status);
      set({
        workOrders: get().workOrders.map(wo => wo.id === id ? { ...wo, ...updated } : wo)
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteWorkOrder: async (id) => {
    try {
      await productionService.deleteWorkOrder(id);
      set({ workOrders: get().workOrders.filter(wo => wo.id !== id) });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
