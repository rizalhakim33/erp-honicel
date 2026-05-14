import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  Settings2,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { useMaintenanceStore } from '../store/useMaintenanceStore';

import { AddMaintenanceLogDialog } from '../components/AddMaintenanceLogDialog';

export default function MaintenancePage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const { logs, fetchLogs, loading } = useMaintenanceStore();

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Asset Maintenance</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Industrial_Care / Preventive_Schedule_v2</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Wrench className="w-3.5 h-3.5 mr-2" />
            SCHEDULE_REPAIR
          </Button>
        </div>
      </div>

      <AddMaintenanceLogDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-zinc-200 rounded-xl shadow-none bg-white lg:col-span-2">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Service Tickets / Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {loading ? (
                <div className="p-12 text-center text-zinc-400 font-mono text-[10px] uppercase italic">Synchronizing with field sensors...</div>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "mt-1 w-2 h-2 rounded-full",
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
                        onClick={() => toast.info(`Accessing settings for ${log.id}...`)}
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

        <div className="space-y-6">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-zinc-900 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">System Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  <span className="text-zinc-400">08:00 - Daily calibration complete</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span className="text-zinc-400">10:15 - High Temp on LINE-04</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <HardDrive className="w-3 h-3 text-blue-500" />
                  <span className="text-zinc-400">12:30 - Backup successful</span>
                </div>
              </div>
              <Button 
                onClick={() => toast.info("Opening master diagnostic logs...")}
                variant="outline" size="sm" className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 text-[9px] uppercase tracking-widest"
              >
                VIEW_ALL_LOGS
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Maintenance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[9px] text-zinc-500 font-mono uppercase">MTTR</div>
                  <div className="text-xl font-bold text-zinc-900">1.4h</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-zinc-500 font-mono uppercase text-right">Uptime</div>
                  <div className="text-xl font-bold text-green-600">99.2%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
