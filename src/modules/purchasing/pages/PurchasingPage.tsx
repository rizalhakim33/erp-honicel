import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Search, Building2, FileText, PackageCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PurchasingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Purchasing</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Supply_Chain / Procurement_Matrix</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9">
            <Plus className="w-3.5 h-3.5 mr-2" />
            NEW_REQUISITION
          </Button>
        </div>
      </div>

      <Tabs defaultValue="po" className="w-full">
        <div className="flex items-center justify-between mb-6 border-b border-zinc-200">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="po" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Purchase_Orders</TabsTrigger>
            <TabsTrigger value="suppliers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Vendors_List</TabsTrigger>
            <TabsTrigger value="receiving" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-0 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 data-[state=active]:text-zinc-900 transition-all">Goods_Receipt</TabsTrigger>
          </TabsList>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 'PO-2024-055', vendor: 'Paper Solutions Inc', date: '2024-05-12', amount: '$4,200.00', status: 'Pending' },
                    { id: 'PO-2024-052', vendor: 'Global Chemicals Ltd', date: '2024-05-10', amount: '$1,150.00', status: 'Shipped' },
                    { id: 'PO-2024-048', vendor: 'EcoPack Materials', date: '2024-05-08', amount: '$12,800.00', status: 'Received' },
                  ].map((po) => (
                    <TableRow key={po.id} className="hover:bg-zinc-50 border-none transition-colors">
                      <TableCell className="font-mono text-xs text-zinc-600">{po.id}</TableCell>
                      <TableCell className="text-xs font-semibold text-zinc-900">{po.vendor}</TableCell>
                      <TableCell className="font-mono text-[10px] text-zinc-500">{po.date}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-zinc-900">{po.amount}</TableCell>
                      <TableCell className="text-right">
                        <span className="px-2 py-0.5 text-[9px] rounded-sm bg-zinc-100 text-zinc-600 font-bold uppercase tracking-tighter">
                          {po.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="mt-0 outline-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Paper Solutions Inc', location: 'Singapore', category: 'Raw Materials', performance: 98 },
              { name: 'Global Chemicals Ltd', location: 'Malaysia', category: 'Chemicals', performance: 92 },
              { name: 'EcoPack Materials', location: 'Indonesia', category: 'Packaging', performance: 95 },
            ].map((v) => (
              <Card key={v.name} className="border border-zinc-200 rounded-xl shadow-none bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-zinc-100 rounded flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 underline decoration-zinc-200 underline-offset-4">{v.name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono italic">{v.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-zinc-50 pt-3">
                    <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase">{v.category}</span>
                    <span className="text-[9px] font-mono text-zinc-400">Rating: {v.performance}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
