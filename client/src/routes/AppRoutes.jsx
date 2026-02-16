import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../utils/constants';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';

// Customer Pages
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import ProfilePage from '../pages/customer/ProfilePage';

// Vehicle Pages
import VehicleListPage from '../pages/vehicle/VehicleListPage';
import AddVehiclePage from '../pages/vehicle/AddVehiclePage';
import EditVehiclePage from '../pages/vehicle/EditVehiclePage';
import VehicleDetailPage from '../pages/vehicle/VehicleDetailPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import CustomerListPage from '../pages/admin/CustomerListPage';
import CustomerDetailPage from '../pages/admin/CustomerDetailPage';
import RegisterCustomerPage from '../pages/admin/RegisterCustomerPage';
import AdminVehicleListPage from '../pages/admin/AdminVehicleListPage';

// Staff Pages
import StaffDashboardPage from '../pages/staff/StaffDashboardPage';

// Policy Pages
import PolicyListPage from '../pages/policy/PolicyListPage';
import PolicyDetailPage from '../pages/policy/PolicyDetailPage';
import PurchasePolicyPage from '../pages/policy/PurchasePolicyPage';
import AdminPolicyListPage from '../pages/admin/AdminPolicyListPage';
import ManagePolicyPage from '../pages/admin/ManagePolicyPage';
import PaymentPage from '../pages/premium/PaymentPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ═══════════════════════════════════════════ */}
      {/*              PUBLIC ROUTES                  */}
      {/* ═══════════════════════════════════════════ */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

      {/* ═══════════════════════════════════════════ */}
      {/*           CUSTOMER ROUTES                   */}
      {/* ═══════════════════════════════════════════ */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><CustomerDashboardPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.STAFF]}>
          <DashboardLayout><ProfilePage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Customer Vehicle Routes */}
      <Route path="/vehicles" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><VehicleListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/vehicles/add" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><AddVehiclePage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/vehicles/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><VehicleDetailPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/vehicles/:id/edit" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><EditVehiclePage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Policy Routes */}
      <Route path="/policies" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.STAFF]}>
          <DashboardLayout><PolicyListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/policies/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.ADMIN, ROLES.STAFF]}>
          <DashboardLayout><PolicyDetailPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/policies/:id/purchase" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><PurchasePolicyPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/premium/pay/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
          <DashboardLayout><PaymentPage /></DashboardLayout>
        </ProtectedRoute>
      } />


      {/* ═══════════════════════════════════════════ */}
      {/*             ADMIN ROUTES                    */}
      {/* ═══════════════════════════════════════════ */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><AdminDashboardPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/customers" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><CustomerListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/customers/new" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><RegisterCustomerPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/customers/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><CustomerDetailPage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Admin Vehicle Routes */}
      <Route path="/admin/vehicles" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><AdminVehicleListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/vehicles/add" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><AddVehiclePage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/vehicles/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><VehicleDetailPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/policies" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><AdminPolicyListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/policies/new" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><ManagePolicyPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/policies/:id/edit" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><ManagePolicyPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/vehicles/:id/edit" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <DashboardLayout><EditVehiclePage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* ═══════════════════════════════════════════ */}
      {/*             STAFF ROUTES                    */}
      {/* ═══════════════════════════════════════════ */}
      <Route path="/staff/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><StaffDashboardPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/customers" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><CustomerListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/customers/new" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><RegisterCustomerPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/customers/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><CustomerDetailPage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* Staff Vehicle Routes */}
      <Route path="/staff/vehicles" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><AdminVehicleListPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/vehicles/add" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><AddVehiclePage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/vehicles/:id" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><VehicleDetailPage /></DashboardLayout>
        </ProtectedRoute>
      } />
      <Route path="/staff/vehicles/:id/edit" element={
        <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
          <DashboardLayout><EditVehiclePage /></DashboardLayout>
        </ProtectedRoute>
      } />

      {/* ═══════════════════════════════════════════ */}
      {/*             ERROR ROUTES                    */}
      {/* ═══════════════════════════════════════════ */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;