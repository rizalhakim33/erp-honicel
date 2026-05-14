import { motion } from 'motion/react';
import { useState } from 'react';
import { Package, Search, Plus, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemTable } from '../components/ItemTable';
import { AddItemDialog } from '../components/AddItemDialog';
import { KPICard } from '@/components/ui/kpi-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner';

export default function InventoryPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Inventory</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">LOGISTICS / WAREHOUSE_A7_SECTOR</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            SECURE_ENTRY
          </Button>
        </div>
      </div>

      <AddItemDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total SKUs" value="154" icon={Package} color="slate" />
        <KPICard title="Stock Value" value="$42,500" icon={Package} color="blue" />
        <KPICard title="Inventory Turnover" value="4.2x" icon={Package} color="green" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-200">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Central_Registry</TabsTrigger>
            <TabsTrigger value="raw" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Raw_Matrix</TabsTrigger>
            <TabsTrigger value="finished" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Export_Ready</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0 outline-none">
          <ItemTable />
        </TabsContent>
        <TabsContent value="raw" className="mt-0 outline-none">
          <div className="p-12 text-center text-zinc-400 bg-white rounded-xl border border-dashed border-zinc-200 font-mono text-xs uppercase tracking-tighter">
            [ACCESSING RAW_MATRIX DATABASE...]
          </div>
        </TabsContent>
        <TabsContent value="finished" className="mt-0 outline-none">
           <div className="p-12 text-center text-zinc-400 bg-white rounded-xl border border-dashed border-zinc-200 font-mono text-xs uppercase tracking-tighter">
            [RETRIEVING EXPORT_READY RECORDS...]
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
