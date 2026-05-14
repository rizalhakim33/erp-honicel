import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search, Factory, ListTree, Activity, AlertCircle, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddWODialog } from '../components/AddWODialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useProductionStore } from '../store/useProductionStore';

export default function ProductionPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { workOrders, fetchWorkOrders, loading } = useProductionStore();

  React.useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Production</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Manufacturing_Ops / Yield_Optimization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            INITIATE_WORK_ORDER
          </Button>
        </div>
      </div>

      <AddWODialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <Tabs defaultValue="work-orders" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-200">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="work-orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Production_Stream</TabsTrigger>
            <TabsTrigger value="bom" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">BOM_Architect</TabsTrigger>
            <TabsTrigger value="efficiency" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Performance_Metrics</TabsTrigger>
          </TabsList>
          <div className="hidden md:flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Opening filter matrix...")} className="h-7 text-[9px] uppercase font-bold tracking-wider rounded-none">
              <Filter className="w-3 h-3 mr-1" /> FILTER
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Generating production report...")} className="h-7 text-[9px] uppercase font-bold tracking-wider rounded-none">
              <Download className="w-3 h-3 mr-1" /> EXPORT
            </Button>
          </div>
        </div>
        
        <TabsContent value="work-orders" className="mt-0 outline-none">
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              <div className="p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">Syncing with production terminal...</div>
            ) : workOrders.length > 0 ? (
              workOrders.map((wo) => {
                const progress = Math.round((wo.produced_quantity / wo.target_quantity) * 100) || 0;
                return (
                  <Card key={wo.id} className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
                    <CardContent className="p-0 flex flex-col md:flex-row items-center">
                       <div className="p-6 border-r border-zinc-100 min-w-[200px] bg-zinc-50/50">
                          <div className="text-[10px] font-mono text-zinc-400 mb-1">REFERENCE_ID</div>
                          <div className="text-sm font-bold text-zinc-900">{wo.wo_number}</div>
                          <div className={cn(
                            "mt-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm inline-block",
                            wo.status === 'in_progress' ? "bg-blue-100 text-blue-700" : wo.status === 'completed' ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-600"
                          )}>
                            Status: {wo.status.replace('_', ' ')}
                          </div>
                       </div>
                       <div className="p-6 flex-1 flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                             <div>
                                <div className="text-xs font-bold text-zinc-900 uppercase tracking-tight">{wo.product_name || 'Internal Product'}</div>
                                <div className="text-[10px] text-zinc-500 font-mono mt-1">Resource Allocation: {wo.machine_name || 'Unassigned'}</div>
                             </div>
                             <div className="text-right">
                                <div className="text-xs font-mono font-bold text-zinc-900">{progress}%</div>
                                <div className="text-[10px] text-zinc-400 font-mono">Realtime Progress</div>
                             </div>
                          </div>
                          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                             <div 
                               className={cn(
                                 "h-full transition-all duration-1000",
                                 progress === 100 ? "bg-green-500" : progress > 50 ? "bg-blue-500" : progress > 0 ? "bg-amber-500" : "bg-zinc-300"
                               )} 
                               style={{ width: `${progress}%` }}
                             />
                          </div>
                       </div>
                       <div className="p-6 border-l border-zinc-100 flex items-center gap-2">
                           <Button 
                             onClick={() => toast.info(`Viewing details for ${wo.wo_number}...`)}
                             variant="outline" size="sm" className="rounded-none font-mono text-[10px] uppercase"
                           >Details</Button>
                           {wo.status !== 'completed' && wo.status !== 'cancelled' && (
                             <Button 
                               onClick={async () => {
                                 const nextStatus = wo.status === 'planned' ? 'in_progress' : 'completed';
                                 try {
                                   const { updateWOStatus } = useProductionStore.getState();
                                   await updateWOStatus(wo.id, nextStatus);
                                   toast.success(`Work Order ${wo.wo_number} transitioned to ${nextStatus}`);
                                 } catch (err) {
                                   toast.error("Failed to update process state");
                                 }
                               }}
                               size="sm" className="bg-zinc-900 text-white rounded-none font-mono text-[10px] uppercase"
                             >
                               {wo.status === 'planned' ? 'START_PROD' : 'MARK_DONE'}
                             </Button>
                           )}
                       </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="p-12 text-center text-zinc-400 border border-zinc-100 rounded-xl bg-zinc-50/30">
                <p className="font-mono text-[10px] uppercase italic">No active production streams detected</p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="link" 
                  className="mt-2 text-blue-600 font-mono text-[10px] uppercase"
                >
                  [INITIATE_FIRST_WO]
                </Button>
              </div>
            )}
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
        <TabsContent value="efficiency" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
               <CardHeader className="border-b border-zinc-100 p-4 bg-zinc-50/50">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Utilization_Matrix</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { machine: 'LINE-01', rate: 94 },
                      { machine: 'SLOTTER-03', rate: 78 },
                      { machine: 'FORMER-02', rate: 82 },
                    ].map(m => (
                      <div key={m.machine} className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span className="text-zinc-600">{m.machine}</span>
                          <span className="text-zinc-900 font-bold">{m.rate}%</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-zinc-900 h-full" style={{ width: `${m.rate}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={() => toast.info("Recalibrating utilization sensors...")}
                    className="w-full mt-6 bg-zinc-900 text-white rounded-none font-mono text-[10px] uppercase h-9"
                  >
                    RECALIBRATE_SYSTEM
                  </Button>
               </CardContent>
            </Card>
            <Card className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
               <CardHeader className="border-b border-zinc-100 p-4 bg-zinc-50/50">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">OEE_Analytics</CardTitle>
               </CardHeader>
               <CardContent className="p-6 flex flex-col items-center justify-center min-h-[160px]">
                  <Activity className="w-12 h-12 text-zinc-200 mb-4" />
                  <p className="text-[10px] font-mono text-zinc-400 uppercase text-center mb-4">Realtime Overall Equipment Effectiveness data streaming active</p>
                  <Button 
                    onClick={() => toast.success("Analytical report dispatched to central terminal")}
                    variant="outline" 
                    className="rounded-none font-mono text-[10px] uppercase h-9 border-zinc-200 px-6"
                  >
                    DOWNLOAD_ANALYTICS
                  </Button>
               </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
