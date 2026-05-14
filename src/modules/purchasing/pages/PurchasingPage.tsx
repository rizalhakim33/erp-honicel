import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search, Building2, FileText, PackageCheck, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AddPODialog } from '../components/AddPODialog';
import { toast } from 'sonner';

import { usePurchasingStore } from '../store/usePurchasingStore';
import { cn } from '@/lib/utils';

export default function PurchasingPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { purchaseOrders, suppliers, fetchPurchaseOrders, fetchSuppliers, loading } = usePurchasingStore();

  React.useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, [fetchPurchaseOrders, fetchSuppliers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Purchasing</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Supply_Chain / Procurement_Matrix</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-2" />
            NEW_REQUISITION
          </Button>
        </div>
      </div>

      <AddPODialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <Tabs defaultValue="po" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-200">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="po" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Purchase_Orders</TabsTrigger>
            <TabsTrigger value="suppliers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Vendors_List</TabsTrigger>
            <TabsTrigger value="receiving" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Goods_Receipt</TabsTrigger>
          </TabsList>
          <div className="hidden md:flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Opening filter matrix...")} className="h-7 text-[9px] uppercase font-bold tracking-wider rounded-none">
              <Filter className="w-3 h-3 mr-1" /> FILTER
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Generating procurement report...")} className="h-7 text-[9px] uppercase font-bold tracking-wider rounded-none">
              <Download className="w-3 h-3 mr-1" /> EXPORT
            </Button>
          </div>
        </div>
        
        <TabsContent value="po" className="mt-0 outline-none">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-4">
               <div className="flex items-center justify-between">
                  <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                    <Input placeholder="SEARCH PO_IDX..." className="pl-9 h-8 rounded-none border-zinc-200 font-mono text-[10px] uppercase" />
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100">
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">PO #</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Vendor</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Order Date</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Amount</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Status</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">Syncing with procurement gateway...</TableCell>
                    </TableRow>
                  ) : purchaseOrders.length > 0 ? (
                    purchaseOrders.map((po) => (
                      <TableRow 
                        key={po.id} 
                        className="hover:bg-zinc-50 border-none transition-colors"
                      >
                        <TableCell className="font-mono text-xs text-zinc-600">{po.po_number}</TableCell>
                        <TableCell className="text-xs font-semibold text-zinc-900">{po.supplier_name || 'Restricted Vendor'}</TableCell>
                        <TableCell className="font-mono text-[10px] text-zinc-500">{new Date(po.order_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-zinc-900">${po.total_amount?.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] rounded-sm font-bold uppercase tracking-tighter",
                            po.status === 'received' ? "bg-green-100 text-green-700" : po.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-500"
                          )}>
                            {po.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {po.status === 'draft' && (
                            <Button 
                              onClick={() => {
                                usePurchasingStore.getState().updatePOStatus(po.id, 'pending');
                                toast.success(`PO ${po.po_number} submitted for approval`);
                              }}
                              variant="ghost" size="sm" className="h-7 text-[9px] uppercase font-bold"
                            >
                              SUBMIT_PO
                            </Button>
                          )}
                          {po.status === 'pending' && (
                            <Button 
                              onClick={() => {
                                usePurchasingStore.getState().updatePOStatus(po.id, 'received');
                                toast.success(`PO ${po.po_number} marked as received`);
                              }}
                              variant="ghost" size="sm" className="h-7 text-[9px] uppercase font-bold text-green-600"
                            >
                              RECEIVE_GOODS
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">No procurement records found in local registry</TableCell>
                    </TableRow>
                  )}
                </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suppliers.length > 0 ? (
              suppliers.map((v) => (
                <Card key={v.id} className="border border-zinc-200 rounded-xl shadow-none bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-zinc-900 underline decoration-zinc-200 underline-offset-4">{v.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono italic">{v.location || 'Unknown Location'}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-50 pt-3">
                      <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">{v.category || 'Vendor'}</span>
                      <span className="text-[9px] font-mono text-zinc-400">Rating: {v.performance_rating || 'N/A'}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">No vendor records found</div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="receiving" className="mt-0 outline-none">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-4">
               <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Inbound_Logistics_Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100">
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Expected_Arrival</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">PO_Ref</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Vendor</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.filter(po => po.status === 'pending').length > 0 ? (
                    purchaseOrders.filter(po => po.status === 'pending').map((po) => (
                      <TableRow key={po.id} className="hover:bg-zinc-50 border-none transition-colors">
                        <TableCell className="font-mono text-xs text-zinc-600">{po.expected_arrival || 'TBA'}</TableCell>
                        <TableCell className="text-xs font-semibold text-zinc-900">{po.po_number}</TableCell>
                        <TableCell className="text-[10px] text-zinc-500 uppercase italic">{po.supplier_name || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                           <Button 
                             onClick={() => {
                               usePurchasingStore.getState().updatePOStatus(po.id, 'received');
                               toast.success(`Inventory updated for ${po.po_number}`);
                             }}
                             size="sm" variant="ghost" className="h-8 py-0 px-2 text-[9px] font-bold uppercase tracking-widest"
                           >
                             PROCESS_RECEIPT
                           </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">No pending inbound logistics</TableCell>
                    </TableRow>
                  )}
                </TableBody>
               </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
