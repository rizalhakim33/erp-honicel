import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '@/modules/auth/hooks/useAuth';

export const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  useAuth(); // Initialize auth listener

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-zinc-50/50">
          <Outlet />
        </main>

        <footer className="h-8 bg-zinc-100 border-t border-zinc-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] text-zinc-400 font-mono uppercase tracking-widest">
            <span>DB: supabase_prod_region_asia</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
            <span>User: SA_ARCHITECT_01</span>
          </div>
          <div className="text-[9px] text-zinc-400 font-mono uppercase">
            Architecture: Clean / Feature-Based / React 19
          </div>
        </footer>
      </div>
    </div>
  );
};
