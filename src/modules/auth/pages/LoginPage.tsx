import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Mail, ArrowRight, Loader2, Factory } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setLoading, isLoading } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Identity credentials incomplete');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error('Identity verification pending. Please confirm your email in your inbox or contact the system administrator (rizal.h33@gmail.com).');
        } else {
          throw error;
        }
        return;
      }
      toast.success('Access Granted - Synchronizing profile...');
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Authentication sequence failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-900/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-md bg-zinc-950 border-zinc-900 shadow-2xl relative z-10 rounded-none border-x-0 sm:border-x sm:rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 pb-8 border-b border-zinc-900 bg-zinc-900/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-sm">
              <Factory className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-mono text-xs font-bold tracking-widest uppercase">Honicel_Intelligence_v4</span>
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight uppercase italic">Honicel ERP</CardTitle>
          <CardDescription className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
            Industrial Resource Planning Gateway / Authorative Access Only
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest font-mono">Operator ID (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="operator@honicel.id" 
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white rounded-none h-11 focus:ring-blue-500 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest font-mono">Secure Token (Password)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white rounded-none h-11 focus:ring-blue-500 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white h-11 rounded-none font-bold uppercase tracking-widest transition-all group"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  INITIALIZE_AUTH <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center px-6">
              <span className="w-full border-t border-zinc-900" />
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-mono tracking-widest text-zinc-500">
              <span className="bg-zinc-950 px-2 italic font-bold">Registration Entrypoint</span>
            </div>
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/register')}
              className="w-full border-zinc-900 bg-transparent text-zinc-500 hover:text-white hover:border-zinc-700 text-[10px] uppercase font-bold tracking-widest rounded-none h-11"
            >
              CREATE_SYSTEM_ACCOUNT
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 text-[9px] text-zinc-600 font-mono tracking-widest">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-zinc-700" />
              TLS_ENCRYPTED
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <div className="flex items-center gap-1">
              2FA_READY
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-6 text-zinc-700 font-mono text-[10px] tracking-widest uppercase">
        © 2026 Honicel Group / Central Intelligence Node
      </div>
    </div>
  );
}
