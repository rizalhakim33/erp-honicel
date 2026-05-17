import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Globe,
  Terminal
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'error' | 'unconfigured'>('checking');

  React.useEffect(() => {
    async function checkConn() {
      if (!isSupabaseConfigured) {
        setDbStatus('unconfigured');
        return;
      }
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setDbStatus('connected');
      } catch (e) {
        console.error('Connection check failed:', e);
        setDbStatus('error');
      }
    }
    checkConn();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">System Configuration</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">Core_Engine / Environment_Attributes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {[
            { label: 'Profile', icon: User, active: true },
            { label: 'Notifications', icon: Bell, active: false },
            { label: 'Security', icon: Shield, active: false },
            { label: 'Connectivity', icon: Database, active: false },
            { label: 'Language', icon: Globe, active: false },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => toast.info(`Switching to ${item.label} matrix...`)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                item.active ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          
          <div className="mt-6 p-4 border border-dashed border-zinc-200 rounded-lg">
             <div className="text-[9px] font-mono uppercase text-zinc-400 mb-2">Supabase_Link</div>
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  dbStatus === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 
                  dbStatus === 'checking' ? 'bg-zinc-300 animate-pulse' :
                  'bg-red-500'
                }`} />
                <span className="text-[10px] font-mono uppercase font-bold text-zinc-700">
                  {dbStatus === 'connected' ? 'Online' : 
                   dbStatus === 'checking' ? 'Checking...' :
                   dbStatus === 'unconfigured' ? 'Not Configured' : 'Offline / RLS Blocked'}
                </span>
             </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="border border-zinc-200 rounded-xl shadow-none bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold">User Identity</CardTitle>
              <CardDescription className="text-xs font-mono uppercase tracking-tight">Modify your system credentials and public alias</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Full_Name</Label>
                  <Input defaultValue="SysAdmin Architect" className="rounded-none border-zinc-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Registry_Email</Label>
                  <Input defaultValue="admin@core-erp.local" className="rounded-none border-zinc-200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Bio_Signature</Label>
                <Input defaultValue="Senior Systems Architect at Manufacturing Hub A1" className="rounded-none border-zinc-200" />
              </div>
              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => toast.success("Changes committed to central registry")}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-none px-6"
                >
                  COMMIT_CHANGES
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-zinc-200 rounded-xl shadow-none bg-zinc-50">
             <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">System Environment</CardTitle>
                </div>
             </CardHeader>
             <CardContent>
                <div className="font-mono text-[10px] text-zinc-400 space-y-1">
                   <div>VERSION: 1.5.0-STABLE</div>
                   <div>NODE_ENV: PRODUCTION</div>
                   <div>KERNAL: REACT_19_NEXT_v15</div>
                   <div>DATABASE: POSTGRES_SQL_v16</div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
