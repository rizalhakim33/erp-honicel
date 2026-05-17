import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './modules/layout/DashboardLayout';
import LoginPage from './modules/auth/pages/LoginPage';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import InventoryPage from './modules/inventory/pages/InventoryPage';
import PurchasingPage from './modules/purchasing/pages/PurchasingPage';
import ProductionPage from './modules/production/pages/ProductionPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import MaintenancePage from './modules/maintenance/pages/MaintenancePage';
import QCPage from './modules/qc/pages/QCPage';
import SettingsPage from './modules/settings/pages/SettingsPage';
import { Toaster } from '@/components/ui/sonner';
import { GlobalDialogs } from './components/GlobalDialogs';
import { useAuthStore } from './modules/auth/store/useAuthStore';
import { useAuth } from './modules/auth/hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
        Syncing_with_global_intelligence_node...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/purchasing" element={<PurchasingPage />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/qc" element={<QCPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <GlobalDialogs />
      <Toaster />
    </Router>
  );
}
