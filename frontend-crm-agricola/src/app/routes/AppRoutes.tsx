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
import { MisProductosPage } from '../../features/products';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      {/* Vista pública de productor — sin login */}
      <Route path="/productores/:profileId" element={<PublicProducerPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route path="/dashboard/cliente" element={<ClientDashboardPage />} />

        <Route path="/dashboard/proveedor" element={<ProviderDashboardPage />} />

        {/* Perfil del productor */}
        <Route path="/dashboard/proveedor/perfil" element={<ProducerProfilePage />} />

        <Route path="/dashboard/administrador" element={<AdminDashboardPage />} />

        <Route path="/dashboard/proveedor/productos" element={<MisProductosPage />} />

        <Route element={<RoleRoute allowedRoles={['ADMINISTRADOR']} />}>
          <Route path="/usuarios" element={<GetUserByIdPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
