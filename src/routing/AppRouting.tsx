import Dashboard from '@/main/Dashboard';
import Etapas from '@/main/Etapas/Etapas';
import Flujos from '@/main/Flujos/Flujos';
import { GeneralTemplate } from '@/templates/GeneralTemplate';
import { Route, Routes } from 'react-router';
import RequireAuthoring from './RequireAuthoring';
import RoutingSecurity from './RoutingSecurity';

export function AppRouting() {
  return (
    <Routes>
      <Route element={<RequireAuthoring />}>
        <Route>
          <Route element={<GeneralTemplate />} path="">
            <Route path="/dashboard" index element={<Dashboard />} />
            <Route path="/" index element={<Dashboard />} />
            <Route path="/flujos" index element={<Flujos />} />
            <Route path="/etapas" index element={<Etapas />} />
            <Route path="/*" index element={<Dashboard />} />
          </Route>
        </Route>
      </Route>
      <Route path="auth/*" element={<RoutingSecurity />} />
    </Routes>
  );
}
