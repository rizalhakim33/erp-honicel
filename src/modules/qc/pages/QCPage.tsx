import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Search, 
  Scan, 
  FileCheck, 
  AlertOctagon,
  History,
  ClipboardList
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useQCStore } from '../store/useQCStore';
import { useDialogStore } from '@/store/useDialogStore';

export default function QCPage() {
  const { open: openDialog } = useDialogStore();
  const { logs, fetchLogs, loading } = useQCStore();

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Quality Assurance</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Compliance_Control / Zero_Defect_Matrix</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => openDialog('qc')}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Scan className="w-3.5 h-3.5 mr-2" />
            INITIATE_SCAN
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">QC Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Surface Uniformity', done: true },
                { label: 'Structural Tensile Strength', done: true },
                { label: 'Adhesive Coverage %', done: false },
                { label: 'Moisture Content Sync', done: false },
              ].map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-[11px] text-zinc-600 font-medium whitespace-nowrap">
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-sm border flex items-center justify-center",
                    check.done ? "bg-green-100 border-green-500" : "border-zinc-300"
                  )}>
                    {check.done && <FileCheck className="w-2.5 h-2.5 text-green-700" />}
                  </div>
                  {check.label}
                </div>
              ))}
              <Button 
                onClick={() => toast.success("Verification sequence initiated")}
                size="sm" variant="outline" className="w-full mt-4 text-[9px] uppercase font-bold tracking-widest h-8"
              >
                RUN_VERIFICATION
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 rounded-xl shadow-none bg-zinc-950 text-zinc-400 font-mono text-[10px] p-4">
             <div className="flex items-center gap-2 text-green-500 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                SYSTEM READY
             </div>
             <div>&gt; LATENCY: 2ms</div>
             <div>&gt; ENCRYPTION: active</div>
             <div>&gt; SCAN_RES: 8k_sigma</div>
          </Card>
        </div>

        <Card className="lg:col-span-3 border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-4">
             <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Registry: Sample Analysis</CardTitle>
                <div className="relative max-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  <Input placeholder="SEARCH_IDX..." className="pl-8 h-8 text-[10px] uppercase font-mono rounded-none" />
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow className="hover:bg-transparent border-b border-zinc-100">
                  <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Test_ID</TableHead>
                  <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">WO_Ref</TableHead>
                  <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Check_Type</TableHead>
                  <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Result</TableHead>
                  <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Auth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                     <TableCell colSpan={5} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">Downloading telemetry data...</TableCell>
                  </TableRow>
                ) : logs.length > 0 ? (
                  logs.map((test) => (
                    <TableRow key={test.id} className="hover:bg-zinc-50 border-none transition-colors">
                      <TableCell className="font-mono text-[9px] text-zinc-400">{test.id.substring(0, 8)}</TableCell>
                      <TableCell className="text-xs font-bold text-zinc-900">{test.wo_number || 'Internal_Batch'}</TableCell>
                      <TableCell className="text-[10px] font-mono text-zinc-400 uppercase">{test.check_type}</TableCell>
                      <TableCell className="text-right">
                         <span className={cn(
                           "px-2 py-0.5 text-[9px] rounded-sm font-bold uppercase",
                           test.status === 'pass' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                         )}>{test.status}</span>
                      </TableCell>
                      <TableCell className="text-right">
                         <Button 
                           onClick={() => toast.info(`Viewing history for test ${test.id}`)}
                           variant="ghost" size="sm" className="h-8 w-8 p-0"
                         >
                            <History className="w-3.5 h-3.5 text-zinc-300" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                     <TableCell colSpan={5} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">No QA records detected in scan buffer</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
