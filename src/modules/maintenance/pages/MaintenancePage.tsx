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

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Asset Maintenance</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Industrial_Care / Preventive_Schedule_v2</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => toast.info("Opening Asset Repair Scheduler...")}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9"
          >
            <Wrench className="w-3.5 h-3.5 mr-2" />
            SCHEDULE_REPAIR
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-zinc-200 rounded-xl shadow-none bg-white lg:col-span-2">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 p-4">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Active Service Tickets</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {[
                { id: 'TKT-104', machine: 'FLUTE-LINE-04', issue: 'Hydraulic Pressure Variance', status: 'Urgent', time: '2h ago' },
                { id: 'TKT-108', machine: 'ROTARY-SLITTER-01', issue: 'Blade Alignment Calibration', status: 'Scheduled', time: 'Tomorrow' },
                { id: 'TKT-112', machine: 'FOLD-GLUER-PRO', issue: 'Software Firmware Update', status: 'Low', time: 'Next week' },
              ].map((tkt) => (
                <div key={tkt.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "mt-1 w-2 h-2 rounded-full",
                      tkt.status === 'Urgent' ? "bg-red-500 animate-pulse" : tkt.status === 'Scheduled' ? "bg-blue-500" : "bg-zinc-300"
                    )}></div>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{tkt.machine}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{tkt.issue}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[9px] font-mono text-zinc-400">REF_{tkt.id}</span>
                        <span className="text-[9px] font-mono text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {tkt.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings2 className="w-4 h-4 text-zinc-400" />
                  </Button>
                </div>
              ))}
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
              <Button variant="outline" size="sm" className="w-full border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 text-[9px] uppercase tracking-widest">
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
