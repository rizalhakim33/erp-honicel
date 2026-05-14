import * as React from 'react';
import { cn } from '@/lib/utils';
import { 
  LineChart, Line, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Filter, TrendingUp, TrendingDown } from 'lucide-react';

const yieldData = [
  { name: 'Mon', target: 4000, actual: 3800 },
  { name: 'Tue', target: 4000, actual: 4100 },
  { name: 'Wed', target: 4000, actual: 3950 },
  { name: 'Thu', target: 4500, actual: 4400 },
  { name: 'Fri', target: 4500, actual: 4600 },
  { name: 'Sat', target: 2000, actual: 2100 },
  { name: 'Sun', target: 0, actual: 0 },
];

const inventoryFlow = [
  { name: 'Jan', pulp: 2400, chemicals: 1400, finished: 4000 },
  { name: 'Feb', pulp: 2100, chemicals: 1200, finished: 3800 },
  { name: 'Mar', pulp: 3200, chemicals: 1800, finished: 4200 },
  { name: 'Apr', pulp: 2800, chemicals: 1600, finished: 3900 },
  { name: 'May', pulp: 3500, chemicals: 2100, finished: 4800 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Intelligence Terminal</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Analytics / System_Reporting_v4.2</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="rounded-none border-zinc-200 font-mono text-[10px] uppercase h-9">
            <Filter className="w-3.5 h-3.5 mr-2" />
            FILTER_SET
          </Button>
          <Button size="sm" className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest h-9 px-4">
            <Download className="w-3.5 h-3.5 mr-2" />
            GENERATE_REPORT
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Yield Analysis */}
        <Card className="border border-zinc-200 rounded-xl shadow-none bg-white">
          <CardHeader className="border-b border-zinc-50 p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Weekly Production Yield Output</CardTitle>
              <div className="flex items-center gap-2 text-[10px] text-green-600 font-bold uppercase">
                 <TrendingUp className="w-3 h-3" /> +2.4% vs PW
              </div>
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
                    cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActual)" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="#71717a" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Flow Matrix */}
        <Card className="border border-zinc-200 rounded-xl shadow-none bg-white">
          <CardHeader className="border-b border-zinc-50 p-4">
             <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-500">Asset Flow & Inventory Registry</CardTitle>
              <RefreshCw className="w-3.5 h-3.5 text-zinc-300 animate-spin-slow" />
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
                      fontSize: '10px'
                    }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="rect" wrapperStyle={{ fontSize: '9px', textTransform: 'uppercase', paddingBottom: '20px' }} />
                  <Bar dataKey="pulp" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={10} name="MATRIX_PULP" />
                  <Bar dataKey="finished" fill="#10b981" radius={[2, 2, 0, 0]} barSize={10} name="FINISHED_GOODS" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Downstream OEE', value: '88.2%', delta: '+1.2%', trend: 'up' },
           { label: 'Asset Churn Rate', value: '4.5%', delta: '-0.8%', trend: 'down' },
           { label: 'Procurement Lead', value: '12d', delta: '+2d', trend: 'down' },
           { label: 'Yield Variance', value: '-0.3%', delta: 'Optimal', trend: 'up' },
         ].map((stat) => (
           <Card key={stat.label} className="border border-zinc-200 rounded-xl shadow-none bg-zinc-50/50">
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
