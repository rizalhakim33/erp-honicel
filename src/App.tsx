import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './modules/layout/DashboardLayout';
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<DashboardLayout />}>
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
