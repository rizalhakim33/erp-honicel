import { create } from 'zustand';
import { qcService, QCLog } from '../services/qcService';

interface QCState {
  logs: QCLog[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  createLog: (log: Omit<QCLog, 'id' | 'created_at'>) => Promise<void>;
}

export const useQCStore = create<QCState>((set, get) => ({
  logs: [],
  loading: false,
  error: null,

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const logs = await qcService.getQCLogs();
      set({ logs, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createLog: async (log) => {
    set({ loading: true, error: null });
    try {
      const newLog = await qcService.createQCLog(log);
      set({ logs: [newLog, ...get().logs], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  }
}));
