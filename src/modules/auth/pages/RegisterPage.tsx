import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error('Requirement matrix incomplete');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            full_name: fullName,
            is_active: false // Needs approval
          });
        
        if (profileError) throw profileError;
      }

      toast.success('Registration sequence successful. Pending Super Admin approval.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Node initialization failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 selection:bg-blue-500/30">
      <Card className="w-full max-w-md bg-zinc-950 border-zinc-900 shadow-2xl rounded-none sm:rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 pb-8 border-b border-zinc-900 bg-zinc-900/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center rounded-sm">
              <Factory className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight uppercase italic">Honicel Registry</CardTitle>
          <CardDescription className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
            Initiating New System Node / Access Subject to Verification
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
             <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest font-mono">Full Operator Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <Input 
                  placeholder="John Doe" 
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white rounded-none h-11"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest font-mono">Operator ID (Email)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <Input 
                  type="email" 
                  placeholder="operator@honicel.id" 
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white rounded-none h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-zinc-500 tracking-widest font-mono">Secure Token (Password)</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-600" />
                <Input 
                  type="password" 
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-white rounded-none h-11"
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
                  REQUEST_ACCESS <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link to="/login" className="text-[10px] text-zinc-500 hover:text-white font-mono uppercase tracking-widest transition-colors">
              Already Registered? Return to Gateway
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
