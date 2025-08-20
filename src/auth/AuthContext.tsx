import { createContext, useContext, useState } from 'react';
import User from '../interfaces/User';

interface LoginProps {
  user: User;
}
interface AuthContextInterface {
  user: User | null;
  login: (user: LoginProps) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextInterface>({
  user: null,
  login: () => {},
  logout: () => {},
});
export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const login = ({ user }: LoginProps) => {
    setUser(user);
  };
  const logout = () => {
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
