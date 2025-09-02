import { MenuConfig, MenuItem } from '@/config/types';
import { MegaMenuSubDefault } from './components';

const MegaMenuSubProfiles = ({ items }: { items: MenuConfig }) => {
  const publicProfilesItem = items[2];

  return (
    <div className="gap-0 lg:w-[375px]">
      {publicProfilesItem.children?.map((item: MenuItem, index) => {
        return (
          <div key={`profile-${index}`}>
            {item.children?.map((item: MenuItem, index) => {
              return (
                <div key={`profile-sub-${index}`} className="space-y-0.5">
                  {item.children && MegaMenuSubDefault(item.children)}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export { MegaMenuSubProfiles };
