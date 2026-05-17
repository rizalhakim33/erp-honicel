import { create } from 'zustand';

type DialogType = 'item' | 'bom' | 'machine' | 'supplier' | 'wo' | 'po' | 'maintenance' | 'qc' | 'product';

interface DialogState {
  openDialogs: Record<DialogType, boolean>;
  dialogData: Record<string, any>;
  open: (type: DialogType, data?: any) => void;
  close: (type: DialogType) => void;
  toggle: (type: DialogType) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  openDialogs: {
    item: false,
    bom: false,
    machine: false,
    supplier: false,
    wo: false,
    po: false,
    maintenance: false,
    qc: false,
    product: false,
  },
  dialogData: {},
  open: (type, data) => set((state) => ({ 
    openDialogs: { ...state.openDialogs, [type]: true },
    dialogData: { ...state.dialogData, [type]: data || null }
  })),
  close: (type) => set((state) => ({ 
    openDialogs: { ...state.openDialogs, [type]: false },
    dialogData: { ...state.dialogData, [type]: null }
  })),
  toggle: (type) => set((state) => ({ 
    openDialogs: { ...state.openDialogs, [type]: !state.openDialogs[type] } 
  })),
}));
