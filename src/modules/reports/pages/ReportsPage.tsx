import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Filter, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportToCSV } from '@/lib/csv';
import { toast } from 'sonner';

export default function ReportsPage() {
  const [yieldData, setYieldData] = React.useState<any[]>([]);
  const [inventoryFlow, setInventoryFlow] = React.useState<any[]>([]);
  const [summaryStats, setSummaryStats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch Production Yield Data (Work Orders)
      const { data: woData } = await supabase
        .from('work_orders')
        .select('created_at, produced_quantity, target_quantity')
        .order('created_at', { ascending: true })
        .limit(30);

      const groupedWO = (woData || []).reduce((acc: any, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        if (!acc[date]) acc[date] = { name: date, actual: 0, target: 0 };
        acc[date].actual += curr.produced_quantity || 0;
        acc[date].target += curr.target_quantity || 0;
        return acc;
      }, {});
      setYieldData(Object.values(groupedWO));

      // Fetch Inventory Data
      const { data: itemsData } = await supabase
        .from('items')
        .select('name, type, stocks(quantity)');

      const groupedItems = (itemsData || []).reduce((acc: any, curr) => {
        const type = curr.type.toUpperCase();
        if (!acc[type]) acc[type] = { name: type, quantity: 0 };
        const q = curr.stocks?.reduce((sAcc: number, s: any) => sAcc + (s.quantity || 0), 0) || 0;
        acc[type].quantity += q;
        return acc;
      }, {});
      setInventoryFlow(Object.values(groupedItems));

      // Summary Stats Calculation
      const totalItems = itemsData?.length || 0;
      const totalStock = itemsData?.reduce((acc, item) => 
        acc + (item.stocks?.reduce((sAcc: number, s: any) => sAcc + (s.quantity || 0), 0) || 0), 0) || 0;
      const lowStockCount = itemsData?.filter(item => 
        (item.stocks?.reduce((sAcc: number, s: any) => sAcc + (s.quantity || 0), 0) || 0) < 10).length || 0;

      setSummaryStats([
        { label: 'Total Unique Assets', value: totalItems, delta: 'Live', trend: 'up' },
        { label: 'Global Stock Units', value: totalStock.toLocaleString(), delta: 'Real-time', trend: 'up' },
        { label: 'Low Stock Alerts', value: lowStockCount, delta: lowStockCount > 0 ? 'Critical' : 'Safe', trend: lowStockCount > 0 ? 'down' : 'up' },
        { label: 'Active WO Cycles', value: woData?.length || 0, delta: '+2 New', trend: 'up' },
      ]);

    } catch (error) {
      console.error('Report Data Error:', error);
      toast.error('Failed to sync intelligence data');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerateReport = () => {
    const reportData = [
      ...summaryStats.map(s => ({ Type: 'Summary', Metric: s.label, Value: s.value, Status: s.delta })),
      ...inventoryFlow.map(i => ({ Type: 'Inventory', Category: i.name, Quantity: i.quantity })),
      ...yieldData.map(y => ({ Type: 'Production', Day: y.name, Produced: y.actual, Target: y.target }))
    ];
    exportToCSV(reportData, 'Intelligence_Report');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Intelligence Terminal</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">Analytics / System_Reporting_v4.2</p>
            {loading && <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={fetchData} className="rounded-none border-zinc-200 font-mono text-[10px] uppercase h-9">
            <RefreshCw className={cn("w-3.5 h-3.5 mr-2", loading && "animate-spin")} />
            SYNC_DATA
          </Button>
          <Button 
            onClick={handleGenerateReport}
            size="sm" 
            className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9 px-4"
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            GENERATE_REPORT
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
          <CardHeader className="border-b border-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Weekly Production Yield Output</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: 'none', 
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '10px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} name="ACTUAL_PRODUCED" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
          <CardHeader className="border-b border-zinc-50 p-4">
             <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Asset Flow & Inventory Registry</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryFlow}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#71717a', fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      border: 'none', 
                      borderRadius: '4px',
                      fontSize: '10px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="quantity" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} name="QTY_ON_HAND" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {summaryStats.map((stat) => (
           <Card key={stat.label} className="border border-zinc-200 rounded-none shadow-none bg-zinc-50/50">
             <CardContent className="p-4">
                <div className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="flex items-baseline justify-between">
                   <div className="text-xl font-mono font-bold text-zinc-900">{stat.value}</div>
                   <div className={cn(
                     "text-[9px] font-bold uppercase",
                     stat.trend === 'up' ? "text-green-600" : "text-amber-600"
                   )}>{stat.delta}</div>
                </div>
             </CardContent>
           </Card>
         ))}
      </div>
    </div>
  );
}

