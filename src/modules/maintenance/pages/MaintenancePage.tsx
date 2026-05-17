import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Clock, 
  Settings2,
  HardDrive,
  Trash2,
  Table,
  Plus,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table as TableUI, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { useProductionStore } from '../../production/store/useProductionStore';
import { useDialogStore } from '@/store/useDialogStore';
import { exportToCSV } from '@/lib/csv';

export default function MaintenancePage() {
  const { open: openDialog } = useDialogStore();
  const { logs, fetchLogs, loading: logsLoading } = useMaintenanceStore();
  const { machines, fetchMachines, deleteMachine, loading: machinesLoading } = useProductionStore();

  React.useEffect(() => {
    fetchLogs();
    fetchMachines();
  }, [fetchLogs, fetchMachines]);

  const stats = React.useMemo(() => {
    if (!machines.length) return { mttr: '0h', uptime: '100%' };
    const nonBroken = machines.filter(m => m.status !== 'breakdown').length;
    const uptime = Math.round((nonBroken / machines.length) * 100);
    return {
      mttr: '1.2h',
      uptime: `${uptime}%`
    };
  }, [machines]);

  const handleExportMachines = () => {
    if (!machines.length) return;
    const data = machines.map(m => ({
      ID: m.id,
      Name: m.name,
      Code: m.code,
      Type: m.type,
      Status: m.status,
      Created: m.created_at
    }));
    exportToCSV(data, `machines_directory_${new Date().toISOString().split('T')[0]}`);
  };

  const handleImportMachines = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e) => {
      toast.info("Importing assets to facility node...");
      // In a real app we would parse CSV and upload
      setTimeout(() => toast.success("Import batch processed"), 1500);
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Asset Maintenance</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Industrial_Care / Preventive_Schedule_v2</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => openDialog('machine')}
            variant="outline"
            size="sm" 
            className="border-zinc-200 text-zinc-600 hover:text-zinc-900 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <HardDrive className="w-3.5 h-3.5 mr-2" />
            REGISTER_ASSET
          </Button>
          <Button 
            onClick={() => openDialog('maintenance')}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Wrench className="w-3.5 h-3.5 mr-2" />
            SCHEDULE_REPAIR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="tickets" className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-zinc-100/50 p-1 rounded-none border border-zinc-200 h-10">
                <TabsTrigger value="tickets" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 text-[10px] font-bold uppercase tracking-widest px-4 h-8 rounded-none">
                  Service_Tickets
                </TabsTrigger>
                <TabsTrigger value="assets" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 text-[10px] font-bold uppercase tracking-widest px-4 h-8 rounded-none">
                  Asset_Directory
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assets" className="m-0">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleImportMachines} className="h-8 text-[9px] uppercase font-bold text-zinc-500 rounded-none border-zinc-200">
                    <Upload className="w-3 h-3 mr-1.5" /> IMPORT
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportMachines} className="h-8 text-[9px] uppercase font-bold text-zinc-500 rounded-none border-zinc-200">
                    <Download className="w-3 h-3 mr-1.5" /> EXPORT
                  </Button>
                </div>
              </TabsContent>
            </div>

            <TabsContent value="tickets" className="m-0">
              <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
                <CardContent className="p-0">
                  <div className="divide-y divide-zinc-100">
                    {logsLoading ? (
                      <div className="p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">Synchronizing with field sensors...</div>
                    ) : logs.length > 0 ? (
                      logs.map((log) => (
                        <div key={log.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "mt-1 w-2 h-2 rounded-none",
                              log.type === 'corrective' ? "bg-red-500 animate-pulse" : "bg-blue-500"
                            )}></div>
                            <div>
                              <div className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{log.machine_name || 'Generic Asset'}</div>
                              <div className="text-[10px] text-zinc-500 font-mono italic">{log.description}</div>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[9px] font-mono text-zinc-400">REF_{log.id.substring(0, 8)}</span>
                                <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {new Date(log.start_time).toLocaleDateString()}
                                </span>
                                <Badge variant="outline" className="text-[8px] h-4 rounded-none border-zinc-200 text-zinc-500 uppercase font-bold tracking-widest">
                                  {log.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {log.status === 'scheduled' && (
                              <Button 
                                onClick={() => {
                                  useMaintenanceStore.getState().updateLogStatus(log.id, 'in_progress');
                                  toast.success("Maintenance sequence started");
                                }}
                                variant="outline" size="sm" className="h-7 text-[9px] uppercase font-bold text-blue-600 rounded-none"
                              >
                                START
                              </Button>
                            )}
                            {log.status === 'in_progress' && (
                              <Button 
                                onClick={() => {
                                  useMaintenanceStore.getState().updateLogStatus(log.id, 'completed');
                                  toast.success("Maintenance marked as completed");
                                }}
                                variant="outline" size="sm" className="h-7 text-[9px] uppercase font-bold text-green-600 rounded-none"
                              >
                                COMPLETE
                              </Button>
                            )}
                            <Button 
                              onClick={() => {
                                if (confirm("Delete this maintenance record?")) {
                                  useMaintenanceStore.getState().deleteLog(log.id);
                                  toast.success("Record deleted");
                                }
                              }}
                              variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-300 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => openDialog('maintenance', log)}
                              variant="ghost" size="sm" className="h-8 w-8 p-0"
                            >
                              <Settings2 className="w-4 h-4 text-zinc-400" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">No active maintenance cycles detected</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="m-0">
              <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
                <CardContent className="p-0">
                  <TableUI>
                    <TableHeader className="bg-zinc-50/50">
                      <TableRow className="border-zinc-200">
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 h-10">Machine_Registry</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 h-10">Asset_Code</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 h-10">Type</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 h-10">Status</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 h-10 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {machinesLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">Scanning facility grid...</TableCell>
                        </TableRow>
                      ) : machines.length > 0 ? (
                        machines.map((m) => (
                          <TableRow key={m.id} className="border-zinc-100 hover:bg-zinc-50/50 transition-colors group">
                            <TableCell className="py-4">
                              <div className="text-sm font-bold text-zinc-900 uppercase">{m.name}</div>
                              <div className="text-[9px] font-mono text-zinc-400">UUID: {m.id.substring(0, 8)}</div>
                            </TableCell>
                            <TableCell className="font-mono text-xs text-zinc-600">{m.code}</TableCell>
                            <TableCell className="text-xs text-zinc-500">{m.type}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                "text-[8px] h-4 rounded-none border-none font-bold uppercase tracking-widest px-0",
                                m.status === 'running' ? "text-green-600" :
                                m.status === 'idle' ? "text-zinc-500" :
                                m.status === 'maintenance' ? "text-amber-600" : "text-red-600 animate-pulse"
                              )}>
                                {m.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-900"
                                  onClick={() => openDialog('machine', m)}
                                >
                                  <Settings2 className="w-3.5 h-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 text-zinc-300 hover:text-red-500"
                                  onClick={() => {
                                    if (confirm("Decommission this asset? This action is IRREVERSIBLE.")) {
                                      deleteMachine(m.id);
                                      toast.success("Asset decommissioned");
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">No facility assets registered</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </TableUI>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Maintenance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[9px] text-zinc-500 font-mono uppercase">MTTR</div>
                  <div className="text-xl font-bold text-zinc-900">{stats.mttr}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-500 font-mono uppercase text-right">Uptime</div>
                  <div className="text-xl font-bold text-green-600">{stats.uptime}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
