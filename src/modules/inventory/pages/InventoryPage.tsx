import { motion } from 'motion/react';
import { useState } from 'react';
import { Package, Search, Plus, Filter, Download, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemTable } from '../components/ItemTable';
import { AddItemDialog } from '../components/AddItemDialog';
import { AdjustStockDialog } from '../components/AdjustStockDialog';
import { AddProductDialog } from '../../production/components/AddProductDialog';
import { KPICard } from '@/components/ui/kpi-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner';

import { useInventoryStore } from '../store/useInventoryStore';
import * as React from 'react';
import { useDialogStore } from '@/store/useDialogStore';

export default function InventoryPage() {
  const { open: openDialog, openDialogs, dialogData, close: closeDialog } = useDialogStore();
  const { items, fetchItems, loading } = useInventoryStore();

  React.useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const totalSKUs = items.length;
  const productCount = items.filter(i => i.category === 'finished_good').length;
  const criticalItemsCount = items.filter(i => i.stock <= (i.min_stock || 0)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Master Registry</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">LOGISTICS / DATA_INFRASTRUCTURE</p>
        </div>
        <div className="flex items-center gap-2">
           <Button 
            onClick={() => openDialog('product')}
            variant="outline"
            size="sm" 
            className="border-zinc-200 text-zinc-600 hover:text-zinc-900 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            REGISTER_FINISHED_GOOD
          </Button>
          <Button 
            onClick={() => openDialog('item')}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            SECURE_ENTRY_MD
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Assets" value={totalSKUs.toString()} icon={Package} color="slate" />
        <KPICard title="End Products" value={productCount.toString()} icon={TrendingUp} color="blue" />
        <KPICard title="Critical items" value={criticalItemsCount.toString()} icon={AlertTriangle} color="red" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-200">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Central_Registry</TabsTrigger>
            <TabsTrigger value="raw" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Raw_Matrix</TabsTrigger>
            <TabsTrigger value="finished" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Product_Library</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0 outline-none">
          <ItemTable />
        </TabsContent>
        <TabsContent value="raw" className="mt-0 outline-none">
          <ItemTable filterType="raw_material" title="Raw_Matrix" />
        </TabsContent>
        <TabsContent value="finished" className="mt-0 outline-none">
          <ItemTable filterType="finished_good" title="Export_Ready" />
        </TabsContent>
      </Tabs>

      <AddItemDialog 
        open={openDialogs.item} 
        onOpenChange={(v) => !v && closeDialog('item')} 
        item={dialogData.item}
      />
      <AddProductDialog
        open={openDialogs.product}
        onOpenChange={(v) => !v && closeDialog('product')}
      />
      <AdjustStockDialog
        open={openDialogs.adjustStock}
        onOpenChange={(v) => !v && closeDialog('adjustStock')}
        item={dialogData.adjustStock}
      />
    </div>
  );
}
