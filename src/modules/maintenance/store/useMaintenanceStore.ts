import { create } from 'zustand';
import { maintenanceService, MaintenanceLog } from '../services/maintenanceService';

interface MaintenanceState {
  logs: MaintenanceLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  createLog: (log: Omit<MaintenanceLog, 'id' | 'status'>) => Promise<void>;
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
  }
}));
