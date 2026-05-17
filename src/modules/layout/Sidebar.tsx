import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Factory, 
  Wrench, 
  ShieldCheck, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/modules/auth/store/useAuthStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Purchasing', href: '/purchasing', icon: ShoppingCart },
  { name: 'Production', href: '/production', icon: Factory },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Quality Control', href: '/qc', icon: ShieldCheck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, setOpen }: { isOpen: boolean, setOpen: (v: boolean) => void }) => {
  const location = useLocation();
  const { user, role, logout } = useAuthStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 text-zinc-50 transition-transform duration-300 lg:static lg:translate-x-0 border-r border-zinc-800",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
            <span className="text-zinc-100 font-bold tracking-tight text-lg uppercase italic">HONICEL ERP</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[2px]">Manufacturing Suite v4.2</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          <div className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest px-3 mb-2 mt-2">Core Modules</div>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20" 
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                )}
              >
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                ) : (
                  <div className="w-2 h-2 rounded-sm border border-zinc-500 group-hover:border-zinc-300" />
                )}
                <span className={cn("text-sm", isActive ? "font-medium italic" : "font-normal")}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 absolute bottom-0 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 font-mono text-xs italic uppercase">
              {user?.email?.substring(0, 2) || 'OP'}
            </div>
            <div>
              <div className="text-xs text-zinc-200 font-medium truncate max-w-[120px]">
                {user?.email?.split('@')[0] || 'Operator_Guest'}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono uppercase">Role: {role || 'Viewer'}</div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
              className="ml-auto p-0 h-6 w-6 text-zinc-500 hover:text-white"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
