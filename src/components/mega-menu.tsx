import { MegaMenuSubProfiles } from '@/partials/mega-menu/mega-menu-sub-profiles';
import { Link, useLocation } from 'react-router-dom';
import { MENU_MEGA } from '@/config/menu.config';
import { cn } from '@/lib/utils';
import { useMenu } from '@/hooks/use-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

export function MegaMenu() {
  const { pathname } = useLocation();
  const { isActive, hasActiveChild } = useMenu(pathname);
  const homeItem = MENU_MEGA[0];
  const publicProfilesItem = MENU_MEGA[1];
  const myAccountItem = MENU_MEGA[2];
  const linkClass = `
    text-sm text-secondary-foreground  text-secondary font-medium rounded-none px-0 border-transparent
    hover:bg-transparent focus:bg-transparent flex flex-row
    data-[active=true]:text-green-marn data-[active=true]:bg-transparent 
    data-[state=open]:text-white data-[state=open]:bg-transparent
    
  `;
  const linkClass2 = `
    text-sm text-secondary-foreground text-secondary font-medium rounded-none px-0  border-transparent
    hover:secondary hover:bg-transparent 
    focus:text-primary focus:bg-transparent 
    data-[active=true]:text-green-marn data-[active=true]:bg-transparent data-[active=true]:border-mono
    data-[state=open]:text-mono data-[state=open]:bg-transparent
    data-[active=false]:bg-transparent data-[state=closed]:bg-transparent
    data-[active=true]:border-mono
  `;
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-7.5">
        {/* Home Item */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to={homeItem.path || '/'}
              className={cn(linkClass)}
              data-active={isActive(homeItem.path) || undefined}
            >
              {homeItem.icon && (
                <homeItem.icon
                  className="size-4"
                  color="#192854"
                  fill="#18CED7"
                />
              )}
              &nbsp;
              {homeItem.title}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to={publicProfilesItem.path || '/'}
              className={cn(linkClass)}
              data-active={isActive(publicProfilesItem.path) || undefined}
            >
              {publicProfilesItem.icon && (
                <publicProfilesItem.icon
                  className="size-4"
                  color="#192854"
                  fill="#18CED7"
                />
              )}
              &nbsp;
              {publicProfilesItem.title}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* My Account Item */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(linkClass2)}
            data-active={hasActiveChild(myAccountItem.children) || undefined}
          >
            {myAccountItem.icon && (
              <myAccountItem.icon
                className="size-4"
                color="#192854"
                fill="#18CED7"
              />
            )}
            &nbsp;{myAccountItem.title}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-0">
            <MegaMenuSubProfiles items={MENU_MEGA} />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
