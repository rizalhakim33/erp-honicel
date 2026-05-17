import * as React from 'react';
import { useDialogStore } from '@/store/useDialogStore';
import { AddItemDialog } from '@/modules/inventory/components/AddItemDialog';
import { AddBOMDialog } from '@/modules/production/components/AddBOMDialog';
import { AddMachineDialog } from '@/modules/maintenance/components/AddMachineDialog';
import { AddSupplierDialog } from '@/modules/purchasing/components/AddSupplierDialog';
import { AddWODialog } from '@/modules/production/components/AddWODialog';
import { AddPODialog } from '@/modules/purchasing/components/AddPODialog';
import { AddMaintenanceLogDialog } from '@/modules/maintenance/components/AddMaintenanceLogDialog';
import { AddQCLogDialog } from '@/modules/qc/components/AddQCLogDialog';
import { AddProductDialog } from '@/modules/production/components/AddProductDialog';

export function GlobalDialogs() {
  const { openDialogs, close } = useDialogStore();

  return (
    <>
      <AddItemDialog 
        open={openDialogs.item} 
        onOpenChange={(open) => !open && close('item')} 
      />
      <AddProductDialog 
        open={openDialogs.product} 
        onOpenChange={(open) => !open && close('product')} 
      />
      <AddBOMDialog 
        open={openDialogs.bom} 
        onOpenChange={(open) => !open && close('bom')} 
      />
      <AddMachineDialog 
        open={openDialogs.machine} 
        onOpenChange={(open) => !open && close('machine')} 
      />
      <AddSupplierDialog 
        open={openDialogs.supplier} 
        onOpenChange={(open) => !open && close('supplier')} 
      />
      <AddWODialog 
        open={openDialogs.wo} 
        onOpenChange={(open) => !open && close('wo')} 
      />
      <AddPODialog 
        open={openDialogs.po} 
        onOpenChange={(open) => !open && close('po')} 
      />
      <AddMaintenanceLogDialog 
        open={openDialogs.maintenance} 
        onOpenChange={(open) => !open && close('maintenance')} 
      />
      <AddQCLogDialog 
        open={openDialogs.qc} 
        onOpenChange={(open) => !open && close('qc')} 
      />
    </>
  );
}
