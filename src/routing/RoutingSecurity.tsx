import Login from '@/auth/Login';
import Logout from '@/auth/Logout';
import { LoginTemplate } from '@/templates/LoginTemplate';
import { Route, Routes } from 'react-router';

export default function RoutingSecurity() {
  return (
    <Routes>
      <Route element={<LoginTemplate />} path="">
        <Route index element={<Login />} />
        <Route path="signin" element={<Login />} />
        <Route path="signout" element={<Logout />} />
      </Route>
    </Routes>
  );
}
