import { Navigate, Route, Routes } from 'react-router-dom';

import {
  AdminDashboardPage,
  ClientDashboardPage,
  LoginPage,
  ProviderDashboardPage,
  RegisterPage,
} from '../../features/auth';
import { GetUserByIdPage } from '../../features/users';
import { ProducerProfilePage, PublicProducerPage } from '../../features/producers';
import { DashboardRedirect } from './DashboardRedirect';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { RoleRoute } from './RoleRoute';
import { MisProductosPage, CatalogoProductosPage } from '../../features/products';
import { CreateOrderPage, MyOrdersPage, OrdersForMyProductsPage } from '../../features/orders';
import { AppShell } from '../../shared/components/layout/AppShell';
import { AuditLogsPage } from '../../features/audit';
import { ChatPage } from '../../features/chat';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      {/* Vista pública de productor — sin login */}
      <Route
        path="/productores/:profileId"
        element={
          <AppShell>
            <PublicProducerPage />
          </AppShell>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route path="/dashboard/cliente" element={<ClientDashboardPage />} />

        <Route path="/dashboard/cliente/productos" element={<CatalogoProductosPage />} />

        <Route path="/dashboard/cliente/pedidos" element={<MyOrdersPage />} />

        <Route path="/dashboard/proveedor" element={<ProviderDashboardPage />} />

        {/* Perfil del productor */}
        <Route path="/dashboard/proveedor/perfil" element={<ProducerProfilePage />} />

        <Route path="/dashboard/administrador" element={<AdminDashboardPage />} />

        <Route path="/dashboard/proveedor/productos" element={<MisProductosPage />} />

        <Route element={<RoleRoute allowedRoles={['CLIENTE']} />}>
          <Route path="/dashboard/cliente/pedidos/nuevo" element={<CreateOrderPage />} />
          <Route path="/dashboard/cliente/chat" element={<ChatPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['PROVEEDOR']} />}>
          <Route path="/dashboard/proveedor/pedidos" element={<OrdersForMyProductsPage />} />
          <Route path="/dashboard/proveedor/chat" element={<ChatPage />} />
        </Route>

        <Route element={<RoleRoute allowedRoles={['ADMINISTRADOR']} />}>
          <Route path="/usuarios" element={<GetUserByIdPage />} />
          <Route path="/auditoria" element={<AuditLogsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
