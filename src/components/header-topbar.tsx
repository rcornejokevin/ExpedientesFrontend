import { useAuth } from '@/auth/AuthContext';
import { UserDropdownMenu } from '@/partials/topbar/user-dropdown-menu';
import { Link } from 'react-router-dom';
import { Label } from './ui/label';

const HeaderTopbar = ({ isMenuShowed }: any) => {
  const { user } = useAuth();
  if (isMenuShowed === false) {
    return <></>;
  }
  return (
    <div className="flex items-center flex-wrap gap-2 lg:gap-3.5">
      <>
        <UserDropdownMenu
          trigger={
            <div className="flex flex-col gap-1 items-center">
              <Label
                className="flex items-center gap-2 font-bold"
                style={{ color: '#ffffff' }}
              >
                {user?.name ?? user?.email}
              </Label>
              <Label
                className="flex items-center gap-2"
                style={{ color: '#ffffff' }}
              >
                {user?.perfil}
              </Label>
            </div>
          }
        />
        <div
          className="border-e border-border h-10 mx-1.5 lg:mx-5"
          style={{
            borderColor: '#C8E42B',
          }}
        ></div>
        <Link to="auth/signout">
          <Label
            className="flex items-center hover:font-bold"
            style={{ color: '#ffffff', cursor: 'pointer' }}
          >
            Salir
          </Label>
        </Link>
      </>
    </div>
  );
};

export { HeaderTopbar };
