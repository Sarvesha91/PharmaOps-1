import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.tsx';
import AdminDashboard from '../pages/AdminDashboard.tsx';
import VendorDashboard from '../pages/VendorDashboard.tsx';
import QADashboard from '../pages/QADashboard.tsx';
import AuditorDashboard from '../pages/AuditorDashboard.tsx';


export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'vendor', element: <VendorDashboard /> },
      { path: 'qa', element: <QADashboard /> },
      { path: 'auditor', element: <AuditorDashboard /> }
      
    ],
  },
]);

export default router;
