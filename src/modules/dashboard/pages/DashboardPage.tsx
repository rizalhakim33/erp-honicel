import { motion } from 'motion/react';
import { 
  Factory, 
  Package, 
  ShoppingCart, 
  Activity, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Control Center</h1>
        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
          <span>System status:</span>
          <span className="flex items-center gap-1.5 text-green-600">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            OPERATIONAL
          </span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <KPICard 
            title="Daily Production" 
            value="1,240" 
            unit="M2" 
            change={5.2} 
            icon={Factory} 
            color="blue"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            title="Active Work Orders" 
            value="14" 
            unit="ORDERS" 
            change={-2.1} 
            icon={Activity} 
            color="blue"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            title="Material Stock alert" 
            value="03" 
            unit="CRITICAL" 
            icon={AlertTriangle} 
            color="red"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            title="Avg. Efficiency" 
            value="94.2" 
            unit="%" 
            change={1.2} 
            icon={TrendingUp} 
            color="green"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Work Orders */}
        <motion.div variants={item} className="lg:col-span-8">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-700">Active Production Line</CardTitle>
              <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 font-mono text-[10px] uppercase tracking-tight">MANAGE_ALL</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100">
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Order ID</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Product / BOM</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-center">Progress</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-100">
                  {[
                    { id: 'WO-2024-001', item: 'Honeycomb Core (10mm x 1200)', sub: 'Material: Kraft 150g', progress: 85, status: 'Production', color: 'green' },
                    { id: 'WO-2024-004', item: 'Pallet Core Board (Double Wall)', sub: 'Material: Virgin Liner 220g', progress: 12, status: 'Staging', color: 'blue' },
                    { id: 'WO-2024-008', item: 'Protective Edge Guard L-Shape', sub: 'Greyboard 450g', progress: 100, status: 'Complete', color: 'zinc' },
                    { id: 'WO-2024-012', item: 'Custom Die-Cut Box Insert', sub: 'B-Flute Single Wall', progress: 45, status: 'Hold', color: 'red' },
                  ].map((wo) => (
                    <TableRow key={wo.id} className="hover:bg-zinc-50 transition-colors border-none group">
                      <TableCell className="font-mono text-xs text-zinc-500 py-4">{wo.id}</TableCell>
                      <TableCell className="py-4">
                        <div className="text-xs font-semibold text-zinc-900">{wo.item}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{wo.sub}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-16 h-1 bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all",
                                wo.color === 'green' ? "bg-green-500" : wo.color === 'blue' ? "bg-blue-500" : wo.color === 'red' ? "bg-red-500" : "bg-zinc-400"
                              )} 
                              style={{ width: `${wo.progress}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400">{wo.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <span className={cn(
                          "px-2 py-0.5 text-[10px] rounded font-bold uppercase",
                          wo.color === 'green' ? "bg-green-100 text-green-700" : 
                          wo.color === 'blue' ? "bg-blue-100 text-blue-700" : 
                          wo.color === 'red' ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"
                        )}>
                          {wo.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <div className="p-3 bg-zinc-50/50 border-t border-zinc-100 mt-auto">
              <div className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest text-center">
                Terminal Sync: Latency 14ms | Archive Ready
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Machine Status */}
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-zinc-950 text-white h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Machine Center (Realtime)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { name: 'ROTARY-SLITTER-01', status: 'Online', health: 98, color: 'green' },
                { name: 'FLUTE-LINE-04', status: 'Maintenance', health: 45, color: 'red' },
                { name: 'FOLD-GLUER-PRO', status: 'Idle', health: 100, color: 'zinc' },
              ].map((m) => (
                <div key={m.name} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        m.color === 'green' ? "bg-green-500 animate-pulse" : m.color === 'red' ? "bg-red-500" : "bg-zinc-500"
                      )}></div>
                      <span className="text-xs font-mono tracking-tight text-zinc-100">{m.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{m.status}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        m.color === 'green' ? "bg-blue-500" : m.color === 'red' ? "bg-red-500" : "bg-zinc-600"
                      )} 
                      style={{ width: `${m.health}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Avg OEE</div>
                      <div className="text-2xl font-mono text-zinc-100">88.4%</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-zinc-500 uppercase font-mono mb-1">Downtime</div>
                      <div className="text-2xl font-mono text-amber-500">42m</div>
                   </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-zinc-100 text-zinc-950 hover:bg-white text-[10px] font-bold uppercase tracking-widest h-10" size="sm">
                SYSTEM_DIAGNOSTICS
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
