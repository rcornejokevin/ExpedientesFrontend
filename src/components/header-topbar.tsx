import { useAuth } from '@/auth/AuthContext';
import { StoreClientTopbar } from '@/pages/store-client/components/common/topbar';
import { Link, useLocation } from 'react-router-dom';
import { Label } from './ui/label';

const HeaderTopbar = ({ isMenuShowed }: any) => {
  const { pathname } = useLocation();
  const { user } = useAuth();
  if (isMenuShowed === false) {
    return <></>;
  }
  return (
    <div className="flex items-center flex-wrap gap-2 lg:gap-3.5">
      {pathname.startsWith('/store-client') ? (
        <StoreClientTopbar />
      ) : (
        <>
          <Label
            className="flex items-center gap-2 font-bold"
            style={{ color: '#ffffff' }}
          >
            {user?.name ?? user?.email}
          </Label>
          <div
            className="border-e border-border h-10 mx-1.5 lg:mx-5"
            style={{
              borderColor: '#C8E42B',
            }}
          ></div>
          <Link to="auth/signout">
            <Label className="flex items-center " style={{ color: '#ffffff' }}>
              Salir
            </Label>
          </Link>
        </>
      )}
    </div>
  );
};

export { HeaderTopbar };
