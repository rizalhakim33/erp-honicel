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

import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { Users, CheckCircle, XCircle } from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SettingsPage() {
  const { user, profile, role } = useAuthStore();
  const [dbStatus, setDbStatus] = React.useState<'checking' | 'connected' | 'error' | 'unconfigured'>('checking');
  const [activeTab, setActiveTab] = React.useState('Profile');
  const [pendingUsers, setPendingUsers] = React.useState<any[]>([]);
  const [rolesList, setRolesList] = React.useState<any[]>([]);
  const isSuperAdmin = user?.email === 'rizal.h33@gmail.com';

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
        
        if (isSuperAdmin) {
            const { data: pending } = await supabase.from('profiles').select('*').eq('is_active', false);
            if (pending) setPendingUsers(pending);

            const { data: rolesData } = await supabase.from('roles').select('*');
            if (rolesData) {
                setRolesList(rolesData);
                
                // Ensure required roles exist
                const requiredRoles = ['admin', 'maintenance_technician'];
                for (const rName of requiredRoles) {
                    if (!rolesData.find(r => r.name === rName)) {
                        await supabase.from('roles').insert([{ name: rName, description: `System ${rName} role` }]);
                        const { data: updatedRoles } = await supabase.from('roles').select('*');
                        if (updatedRoles) setRolesList(updatedRoles);
                    }
                }
            }
        }
      } catch (e) {
        console.error('Connection check failed:', e);
        setDbStatus('error');
      }
    }
    checkConn();
  }, [isSuperAdmin]);

  const handleApprove = async (userId: string, roleId?: string) => {
    try {
        const updateData: any = { is_active: true };
        if (roleId) updateData.role_id = roleId;
        
        const { error } = await supabase.from('profiles').update(updateData).eq('id', userId);
        if (error) throw error;
        toast.success('Access authorized for node');
        setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (e) {
        toast.error('Approval sequence failed');
    }
  };

  const [fullName, setFullName] = React.useState(profile?.full_name || '');
  const [bio, setBio] = React.useState(`Role: ${role || 'Viewer'}`);

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(`Role: ${role || 'Viewer'}`);
    }
  }, [profile, role]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);
      
      if (error) throw error;
      
      useAuthStore.getState().setProfile({ ...profile, full_name: fullName });
      toast.success("Profile updated successfully");
      // Optional: Refresh session/profile
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

  const menuItems = [
    { label: 'Profile', icon: User },
    { label: 'Notifications', icon: Bell },
    { label: 'Security', icon: Shield },
    { label: 'Connectivity', icon: Database },
  ];

  if (isSuperAdmin) {
    menuItems.push({ label: 'User Admin', icon: Users });
  }

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
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === item.label ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
          
          <div className="mt-6 p-4 border border-dashed border-zinc-200 rounded-none">
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
          {activeTab === 'Profile' && (
            <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">User Identity</CardTitle>
                <CardDescription className="text-xs font-mono uppercase tracking-tight">Modify your system credentials and public alias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Full_Name</Label>
                    <Input 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="rounded-none border-zinc-200" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Registry_Email</Label>
                    <Input value={user?.email || ''} readOnly className="rounded-none border-zinc-200 bg-zinc-50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-zinc-500 font-mono">Bio_Signature</Label>
                  <Input 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="rounded-none border-zinc-200" 
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleUpdateProfile}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase tracking-widest rounded-none px-6"
                  >
                    COMMIT_CHANGES
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'User Admin' && isSuperAdmin && (
            <Card className="border border-zinc-200 rounded-none shadow-none bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold">Pending Approvals</CardTitle>
                <CardDescription className="text-xs font-mono uppercase tracking-tight">Authorize new nodes seeking system access</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingUsers.length > 0 ? (
                    <div className="space-y-4">
                        {pendingUsers.map((u) => {
                            const [selectedRoleId, setSelectedRoleId] = React.useState<string | undefined>(u.role_id);
                            return (
                                <div key={u.id} className="flex items-center justify-between p-4 border border-zinc-100 bg-zinc-50/50 rounded-sm">
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-zinc-900">{u.full_name}</div>
                                        <div className="text-[10px] font-mono text-zinc-500 uppercase">{u.email}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                                            <SelectTrigger className="w-[180px] h-8 text-[10px] font-mono uppercase rounded-none border-zinc-200">
                                                <SelectValue placeholder="Assign Role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {rolesList.map(r => (
                                                    <SelectItem key={r.id} value={r.id} className="text-[10px] font-mono uppercase">
                                                        {r.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex gap-2">
                                            <Button 
                                                size="sm" 
                                                onClick={() => handleApprove(u.id, selectedRoleId)}
                                                className="bg-zinc-900 text-white rounded-none h-8 text-[9px] font-mono uppercase"
                                            >
                                                <CheckCircle className="w-3 h-3 mr-1" /> APPROVE
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="outline"
                                                className="border-zinc-200 text-zinc-500 hover:text-red-600 rounded-none h-8 text-[9px] font-mono uppercase"
                                            >
                                                <XCircle className="w-3 h-3 mr-1" /> REJECT
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <Users className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">No pending authorization requests detected</div>
                    </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border border-zinc-200 rounded-none shadow-none bg-zinc-50">
             <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">System Environment</CardTitle>
                </div>
             </CardHeader>
             <CardContent>
                <div className="font-mono text-[10px] text-zinc-400 space-y-1">
                   <div>VERSION: 4.2.0-ENTERPRISE</div>
                   <div>NODE_ENV: PRODUCTION</div>
                   <div>KERNAL: REACT_19_NEXT_v15</div>
                   <div>DATABASE: {isSupabaseConfigured ? 'SUPABASE_POSTGRES' : 'LOCAL_STORAGE_MOCK'}</div>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
