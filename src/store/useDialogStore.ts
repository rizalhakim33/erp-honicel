import { create } from 'zustand';

type DialogType = 'item' | 'bom' | 'machine' | 'supplier' | 'wo' | 'po' | 'maintenance' | 'qc' | 'product';

interface DialogState {
  openDialogs: Record<DialogType, boolean>;
  open: (type: DialogType) => void;
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
  open: (type) => set((state) => ({ 
    openDialogs: { ...state.openDialogs, [type]: true } 
  })),
  close: (type) => set((state) => ({ 
    openDialogs: { ...state.openDialogs, [type]: false } 
  })),
  toggle: (type) => set((state) => ({ 
    openDialogs: { ...state.openDialogs, [type]: !state.openDialogs[type] } 
  })),
}));
