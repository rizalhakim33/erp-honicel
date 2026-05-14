import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search, Factory, ListTree, Activity, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { toast } from 'sonner';

export default function ProductionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Production</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Manufacturing_Ops / Yield_Optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => toast.info("Initializing Work Order Wizard...")}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            INITIATE_WORK_ORDER
          </Button>
        </div>
      </div>

      <Tabs defaultValue="work-orders" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-200">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="work-orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Production_Stream</TabsTrigger>
            <TabsTrigger value="bom" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">BOM_Architect</TabsTrigger>
            <TabsTrigger value="efficiency" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Performance_Metrics</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="work-orders" className="mt-0 outline-none">
          <div className="grid grid-cols-1 gap-6">
            {[
              { id: 'WO-101', product: 'HC-20 Honeycomb Panel', progress: 75, machine: 'LINE-01', priority: 'High' },
              { id: 'WO-105', product: 'CB-A1 Shipping Box', progress: 20, machine: 'SLOTTER-03', priority: 'Normal' },
              { id: 'WO-110', product: 'EP-L45 Edge Protector', progress: 0, machine: 'FORMER-02', priority: 'Urgent' },
            ].map((wo) => (
              <Card key={wo.id} className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
                <CardContent className="p-0 flex flex-col md:flex-row items-center">
                   <div className="p-6 border-r border-zinc-100 min-w-[200px] bg-zinc-50/50">
                      <div className="text-[10px] font-mono text-zinc-400 mb-1">REFERENCE_ID</div>
                      <div className="text-sm font-bold text-zinc-900">{wo.id}</div>
                      <div className={cn(
                        "mt-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm inline-block",
                        wo.priority === 'Urgent' ? "bg-red-100 text-red-700" : wo.priority === 'High' ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"
                      )}>
                        Priority: {wo.priority}
                      </div>
                   </div>
                   <div className="p-6 flex-1 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{wo.product}</div>
                            <div className="text-[10px] text-zinc-500 font-mono mt-1">Resource Allocation: {wo.machine}</div>
                         </div>
                         <div className="text-right">
                            <div className="text-xs font-mono font-bold text-zinc-900">{wo.progress}%</div>
                            <div className="text-[10px] text-zinc-400 font-mono">Realtime Progress</div>
                         </div>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                         <div 
                           className={cn(
                             "h-full transition-all duration-1000",
                             wo.progress === 100 ? "bg-green-500" : wo.progress > 50 ? "bg-blue-500" : wo.progress > 0 ? "bg-amber-500" : "bg-zinc-300"
                           )} 
                           style={{ width: `${wo.progress}%` }}
                         />
                      </div>
                   </div>
                   <div className="p-6 border-l border-zinc-100 flex items-center gap-2">
                       <Button 
                         onClick={() => toast.info(`Viewing details for ${wo.id}...`)}
                         variant="outline" size="sm" className="rounded-none font-mono text-[10px] uppercase"
                       >Details</Button>
                       <Button 
                         onClick={() => toast.success(`Updating state for ${wo.id}...`)}
                         size="sm" className="bg-zinc-900 text-white rounded-none font-mono text-[10px] uppercase"
                       >Update_State</Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bom" className="mt-0 outline-none">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white">
            <CardHeader className="border-b border-zinc-100 p-4 bg-zinc-50/50">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Bill of Materials - Structural Blueprint</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100">
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">FG_Product</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Components_Qty</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Process_Flow</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { product: 'Honeycomb Panel 20mm', comps: 4, process: 'Expander -> Lamination -> Cutting' },
                    { product: 'Edge Guard V-Profile', comps: 2, process: 'Forming -> Pressing -> Packing' },
                  ].map((bom) => (
                    <TableRow key={bom.product} className="hover:bg-zinc-50 border-none">
                      <TableCell className="text-xs font-bold text-zinc-900">{bom.product}</TableCell>
                      <TableCell className="font-mono text-xs text-zinc-600">{bom.comps} Items</TableCell>
                      <TableCell className="text-[10px] text-zinc-500 italic uppercase">{bom.process}</TableCell>
                      <TableCell className="text-right">
                         <Button 
                           onClick={() => toast.info(`Accessing BOM structure for ${bom.product}...`)}
                           variant="ghost" size="sm" className="h-8 w-8 p-0 cursor-pointer"
                         >
                            <ListTree className="w-3.5 h-3.5 text-zinc-400" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
