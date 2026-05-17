import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Factory, LogOut, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function PendingApprovalPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRefresh = () => {
    toast.info('Checking approval status...');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-900 shadow-2xl rounded-none py-8">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
             <div className="relative">
                <div className="w-16 h-16 bg-blue-900/20 flex items-center justify-center rounded-full animate-pulse">
                    <Clock className="w-8 h-8 text-blue-500" />
                </div>
                <div className="absolute -bottom-1 -right-1">
                    <Factory className="w-6 h-6 text-zinc-700" />
                </div>
             </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight uppercase italic">Access Pending</CardTitle>
          <div className="space-y-2">
            <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
              Operator: <span className="text-white">{user?.email}</span>
            </p>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
              Your registration is currently being verified by the Super Admin. You will be granted system access once authorization is complete.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button 
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-none font-mono text-[10px] uppercase tracking-widest"
          >
            <RefreshCcw className="w-3 h-3 mr-2" /> RECHECK_STATUS
          </Button>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="w-full border-zinc-900 bg-transparent text-zinc-500 hover:text-white hover:border-zinc-700 rounded-none font-mono text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-3 h-3 mr-2" /> LOGOUT_NODE
          </Button>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 text-zinc-800 font-mono text-[8px] tracking-[4px] uppercase text-center w-full">
        Central Intelligence Verification Cycle Active
      </div>
    </div>
  );
}
