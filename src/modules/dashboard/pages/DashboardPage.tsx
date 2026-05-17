import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
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

import { useProductionStore } from '../../production/store/useProductionStore';
import { useInventoryStore } from '../../inventory/store/useInventoryStore';
import { useMaintenanceStore } from '../../maintenance/store/useMaintenanceStore';
import * as React from 'react';

export default function DashboardPage() {
  const { workOrders, machines, fetchWorkOrders, fetchMachines, loading: prodLoading } = useProductionStore();
  const { items, fetchItems } = useInventoryStore();
  const { logs, fetchLogs } = useMaintenanceStore();

  React.useEffect(() => {
    fetchWorkOrders();
    fetchMachines();
    fetchItems();
    fetchLogs();
  }, [fetchWorkOrders, fetchMachines, fetchItems, fetchLogs]);

  const activeWOs = workOrders.filter(wo => wo.status === 'in_progress' || wo.status === 'planned');
  const criticalStock = items.filter(i => i.stock <= (i.min_stock || 0));
  const dashboardActiveWOs = activeWOs.slice(0, 4);
  const dashboardMachines = machines.slice(0, 4);

  const utilization = React.useMemo(() => {
    if (!machines.length) return 0;
    const running = machines.filter(m => m.status === 'running').length;
    return Math.round((running / machines.length) * 100);
  }, [machines]);

  const uptime = React.useMemo(() => {
    if (!machines.length) return 100;
    const functioning = machines.filter(m => m.status !== 'breakdown').length;
    return Math.round((functioning / machines.length) * 100);
  }, [machines]);

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
            title="Total Items" 
            value={items.length.toString()} 
            unit="SKUS" 
            icon={Package} 
            color="slate"
            href="/inventory"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            title="Active Work Orders" 
            value={activeWOs.length.toString()} 
            unit="ORDERS" 
            icon={Activity} 
            color="blue"
            href="/production"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            title="Material Stock Alert" 
            value={criticalStock.length.toString()} 
            unit="CRITICAL" 
            icon={AlertTriangle} 
            color="red"
            href="/inventory"
          />
        </motion.div>
        <motion.div variants={item}>
          <KPICard 
            title="Maintenance Uptime" 
            value={`${uptime}%`} 
            unit="HEALTH" 
            icon={TrendingUp} 
            color="slate"
            href="/maintenance"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Work Orders */}
        <motion.div variants={item} className="lg:col-span-8">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-zinc-100 bg-zinc-50/50">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-700">Active Production Line</CardTitle>
              <Button asChild variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 font-mono text-[10px] uppercase tracking-tight">
                <Link to="/production">MANAGE_ALL</Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-zinc-50">
                  <TableRow className="hover:bg-transparent border-b border-zinc-100">
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Order ID</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Product / BOM</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic">Status</TableHead>
                    <TableHead className="text-[10px] font-mono text-zinc-400 uppercase italic text-right">Production (Units)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-100">
                  {prodLoading ? (
                    <TableRow>
                       <TableCell colSpan={4} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">Syncing with production terminal...</TableCell>
                    </TableRow>
                  ) : dashboardActiveWOs.length > 0 ? (
                    dashboardActiveWOs.map((wo) => {
                      return (
                        <TableRow key={wo.id} className="hover:bg-zinc-50 transition-colors border-none group">
                          <TableCell className="font-mono text-xs text-zinc-500 py-4">{wo.wo_number}</TableCell>
                          <TableCell className="py-4">
                            <div className="text-xs font-semibold text-zinc-900">{wo.product_name || 'N/A'}</div>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className={cn(
                              "px-2 py-0.5 text-[10px] rounded font-bold uppercase",
                              wo.status === 'completed' ? "bg-green-100 text-green-700" : 
                              wo.status === 'in_progress' ? "bg-blue-100 text-blue-700" : 
                              wo.status === 'cancelled' ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"
                            )}>
                              {wo.status.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell className="text-right py-4 font-mono text-xs text-zinc-900 font-bold">
                            {wo.produced_quantity} / {wo.target_quantity}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center font-mono text-[10px] uppercase italic text-zinc-400">No recent production cycles</TableCell>
                    </TableRow>
                  )}
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

        {/* Asset Health Monitoring */}
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white h-full flex flex-col">
            <CardHeader className="pb-4 border-b border-zinc-50 bg-zinc-50/30">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 font-mono">Asset Health Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {dashboardMachines.length > 0 ? (
                dashboardMachines.map((m) => {
                  const health = m.status === 'running' ? 100 : m.status === 'idle' ? 90 : m.status === 'maintenance' ? 45 : 10;
                  const color = m.status === 'running' ? 'green' : m.status === 'idle' ? 'blue' : m.status === 'maintenance' ? 'amber' : 'red';
                  return (
                    <div key={m.id} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            color === 'green' ? "bg-green-500 animate-pulse" : 
                            color === 'blue' ? "bg-blue-500" :
                            color === 'amber' ? "bg-amber-500" : "bg-red-500"
                          )}></div>
                          <span className="text-xs font-mono tracking-tight text-zinc-900 font-bold">{m.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-zinc-400 uppercase italic">{m.status}</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-1000",
                            color === 'green' ? "bg-green-500" : color === 'amber' ? "bg-amber-400" : "bg-red-500"
                          )} 
                          style={{ width: `${health}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center font-mono text-[10px] uppercase text-zinc-400 italic">No assets detected</div>
              )}
              
              <div className="mt-4 pt-4 border-t border-zinc-100">
                <div className="flex justify-between items-end">
                   <div>
                      <div className="text-[10px] text-zinc-400 uppercase font-mono mb-1">Utilization</div>
                      <div className="text-xl font-mono text-zinc-900 font-bold tracking-tighter">{utilization}%</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono mb-1">Queue_Size</div>
                      <div className="text-xl font-mono text-blue-600 font-bold tracking-tighter">{activeWOs.length}</div>
                   </div>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full mt-4 border-zinc-200 text-zinc-600 hover:text-zinc-900 text-[10px] font-bold uppercase tracking-widest h-10 rounded-none border-dashed" size="sm">
                <Link to="/maintenance">ASSET_FACILITY_LOGS</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
