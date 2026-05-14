import { create } from 'zustand';
import { maintenanceService, MaintenanceLog } from '../services/maintenanceService';

interface MaintenanceState {
  logs: MaintenanceLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  createLog: (log: Omit<MaintenanceLog, 'id'>) => Promise<void>;
  updateLogStatus: (id: string, status: MaintenanceLog['status']) => Promise<void>;
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  logs: [],
  loading: false,
  error: null,

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const logs = await maintenanceService.getLogs();
      set({ logs, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createLog: async (log) => {
    set({ loading: true, error: null });
    try {
      const newLog = await maintenanceService.createLog(log);
      set({ logs: [newLog, ...get().logs], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateLogStatus: async (id, status) => {
    try {
      await maintenanceService.updateLogStatus(id, status);
      const logs = get().logs.map(l => l.id === id ? { ...l, status } : l);
      set({ logs });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  }
}));
