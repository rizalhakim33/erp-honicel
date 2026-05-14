import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './modules/layout/DashboardLayout';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import InventoryPage from './modules/inventory/pages/InventoryPage';
import PurchasingPage from './modules/purchasing/pages/PurchasingPage';
import ProductionPage from './modules/production/pages/ProductionPage';
import ReportsPage from './modules/reports/pages/ReportsPage';
import { Toaster } from '@/components/ui/sonner';

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
          <Route path="/maintenance" element={<div className="p-8 font-mono text-zinc-400 uppercase">[DECRYPTING MAINTENANCE_LOGS...]</div>} />
          <Route path="/qc" element={<div className="p-8 font-mono text-zinc-400 uppercase">[SCANNING QUALITY_CONTROL_UNIT...]</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}
