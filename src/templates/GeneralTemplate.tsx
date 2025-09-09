import { useEffect } from 'react';
import { useAuth } from '@/auth/AuthContext';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { setUnauthorizedHandler } from '@/lib/apiRequest';
import { useBodyClass } from '@/hooks/use-body-class';
import { useMenu } from '@/hooks/use-menu';
import { useSettings } from '@/providers/settings-provider';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

const GeneralTemplate = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      navigate('/login');
    });
    return () => setUnauthorizedHandler(null);
  }, [logout, navigate]);
  const { setOption } = useSettings();
  const { pathname } = useLocation();
  const { getCurrentItem } = useMenu(pathname);
  const item = getCurrentItem(MENU_SIDEBAR);

  // Using the custom hook to set multiple CSS variables and class properties
  useBodyClass(`
    [--header-height-default:95px]
    data-[sticky-header=on]:[--header-height:60px]
    [--header-height:var(--header-height-default)]	
    [--header-height-mobile:70px]	
  `);

  useEffect(() => {
    setOption('layout', 'demo7');
  }, [setOption]);

  return (
    <>
      <Helmet>
        <title>{item?.title}</title>
      </Helmet>
      <div className="grow min-h-screen flex flex-col in-data-[sticky-header=on]:pt-(--header-height-default)">
        <Header isMenuShowed={true} />

        <div className="flex-1 min-h-0" role="content">
          <div className="relative overflow-hidden w-full h-full bg-gradient-to-b from-[#FFFFFF] to-[#E2E8EB]">
            <img
              src="/media/images/marn_volcanes.png"
              alt="Fondo volcanes MARN"
              className="pointer-events-none absolute bottom-0 inset-x-0 w-full object-cover z-[1]"
            />
            <div className="relative z-20">
              <Outlet />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export { GeneralTemplate };
