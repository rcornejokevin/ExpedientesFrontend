import { useAuth } from '@/auth/AuthContext';
import CamposGeneral from '@/main/Campos_General/Campos';
import Campos from '@/main/Campos/Campos';
import Dashboard from '@/main/Dashboard';
import Etapas from '@/main/Etapas/Etapas';
import Flujos from '@/main/Flujos/Flujos';
import SubEtapas from '@/main/SubEtapas/SubEtapas';
import Usuarios from '@/main/Usuario/Usuarios';
import { GeneralTemplate } from '@/templates/GeneralTemplate';
import { Route, Routes } from 'react-router';
import RequireAuthoring from './RequireAuthoring';
import RoutingSecurity from './RoutingSecurity';

export function AppRouting() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route element={<RequireAuthoring />}>
        <Route>
          <Route element={<GeneralTemplate />} path="">
            <Route path="/dashboard" index element={<Dashboard />} />
            <Route path="/" index element={<Dashboard />} />
            <Route path="/flujos" index element={<Flujos />} />
            <Route path="/etapas" index element={<Etapas />} />
            <Route path="/subetapas" index element={<SubEtapas />} />
            {user?.role == 'Super' ? (
              <Route path="/campos" index element={<CamposGeneral />} />
            ) : (
              <Route path="/campos" index element={<Campos />} />
            )}
            <Route path="/usuarios" index element={<Usuarios />} />
            <Route path="/*" index element={<Dashboard />} />
          </Route>
        </Route>
      </Route>
      <Route path="auth/*" element={<RoutingSecurity />} />
    </Routes>
  );
}
