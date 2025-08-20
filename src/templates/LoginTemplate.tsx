import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { MENU_SIDEBAR } from '@/config/menu.config';
import { useBodyClass } from '@/hooks/use-body-class';
import { useMenu } from '@/hooks/use-menu';
import { useSettings } from '@/providers/settings-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Footer } from '../components/footer';
import { Header } from '../components/header';

const LoginTemplate = () => {
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
      <div className="flex grow flex-col in-data-[sticky-header=on]:pt-(--header-height-default)">
        <Header isMenuShowed={false} />
        <div className="flex grow" role="content">
          <div className="flex flex-col items-center justify-center grow bg-center bg-no-repeat page-bg">
            <Card className="w-full max-w-[400px]">
              <CardContent className="p-6">
                <Outlet />
              </CardContent>
            </Card>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export { LoginTemplate };
