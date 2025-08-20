import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MegaMenu } from './mega-menu';
import { MegaMenuMobile } from './mega-menu-mobile';
import { Label } from './ui/label';

const HeaderLogo = ({ isMenuShowed }: any) => {
  const { pathname } = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-stretch gap-1.5 lg:gap-10 grow">
      <div className="flex items-center gap-2.5">
        <Link to="/dashboard">
          <img
            src={toAbsoluteUrl('/logos/marn_blanco.png')}
            alt="logo"
            className="dark:inline-block min-h-[34px] max-h-[34px] lg:min-h-[70px] lg:max-h-[70px]"
          />
        </Link>
        <div
          className="border-e border-border h-15 mx-1.5 lg:mx-5"
          style={{
            borderColor: '#C8E42B',
          }}
        ></div>
        <div className="w-40">
          <Label
            className="flex items-center gap-2 font-bold"
            style={{ color: '#ffffff' }}
          >
            Sistema de Expedientes Jurídicos
          </Label>
        </div>
      </div>
      {isMenuShowed === true &&
        (!isMobile ? (
          <MegaMenu />
        ) : (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="dim"
                mode="icon"
                aria-label="Abrir menú"
                className="data-[state=open]:text-[var(--color-green-marn)]"
              >
                <Menu />
              </Button>
            </SheetTrigger>

            {/* Nota: SheetContent NO tiene prop 'close'. */}
            <SheetContent side="left" className="p-0 gap-0 w-[275px]">
              {/* shadcn/ui no trae <SheetBody>, usa un contenedor normal */}
              <div className="p-0 flex flex-col grow">
                <MegaMenuMobile />
              </div>
            </SheetContent>
          </Sheet>
        ))}
    </div>
  );
};

export { HeaderLogo };
