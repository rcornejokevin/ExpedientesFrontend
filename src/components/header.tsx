import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { HeaderLogo } from './header-logo';
import { HeaderTopbar } from './header-topbar';

const Header = ({ isMenuShowed }: any) => {
  const { settings } = useSettings();
  const scrollPosition = useScrollPosition();
  const [headerStickyOn, setHeaderStickyOn] = useState(false);

  useEffect(() => {
    const isSticky = scrollPosition > settings.layouts.demo2.headerStickyOffset;
    setHeaderStickyOn(isSticky);
  }, [scrollPosition, settings]);

  useEffect(() => {
    if (headerStickyOn === true) {
      document.body.setAttribute('data-sticky-header', 'on');
    } else {
      document.body.removeAttribute('data-sticky-header');
    }
  }, [headerStickyOn]);

  return (
    <header
      style={{ backgroundColor: '#192854' }}
      className={cn(
        'flex items-center transition-[height] shrink-0 bg-background py-4 lg:py-0 lg:h-(--header-height)',
        headerStickyOn &&
          'transition-[height] fixed z-10 top-0 left-0 right-0 shadow-xs backdrop-blur-md bg-background/70 pe-[var(--removed-body-scroll-bar-size,0px)]',
      )}
    >
      <Container width="fluid" className="!mx-0 !px-0">
        <div className="flex w-full flex-wrap items-center gap-2 pe-4 lg:gap-4 lg:pe-6">
          <HeaderLogo isMenuShowed={isMenuShowed} />
          <HeaderTopbar isMenuShowed={isMenuShowed} />
        </div>
      </Container>
    </header>
  );
};

export { Header };
