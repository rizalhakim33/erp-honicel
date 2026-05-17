import { Link } from 'react-router-dom';
import { Bell, Search, User, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { supabase } from '@/lib/supabase';

export const Topbar = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden p-0" onClick={onOpenSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <Link to="/" className="flex items-center text-[11px] text-zinc-500 font-mono tracking-tight hover:opacity-80 transition-opacity">
          <span className="hover:text-zinc-900 cursor-pointer font-bold italic">HONICEL-ERP</span>
          <span className="mx-2 text-zinc-300">/</span>
          <span className="text-zinc-900 font-bold uppercase tracking-wider">Operations Dashboard</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold border border-green-200 rounded uppercase tracking-wide">
          Supabase: Connected
        </div>
        
        <div className="h-4 w-[1px] bg-zinc-200 mx-1 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 rounded-full border border-zinc-200 bg-zinc-50 p-0 flex items-center justify-center cursor-pointer hover:bg-zinc-100 transition-colors">
            <Avatar className="w-full h-full">
              <AvatarFallback className="text-[10px] bg-zinc-100 text-zinc-600 font-mono italic">SA</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>System Administrator</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link to="/settings" className="flex items-center" />}>
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Initializing Secure Console...")}>Console Access</DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Fetching Audit Logs...")}>Audit Logs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 font-bold">
              Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
