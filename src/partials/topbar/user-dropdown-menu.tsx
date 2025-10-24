import { ReactNode, useState } from 'react';
import ChangePassword from '@/main/Usuario/ChangePassword';
import { Key } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" side="bottom" align="end">
          <DropdownMenuItem asChild>
            <div
              className="flex items-center gap-2"
              onClick={() => {
                setIsChangePasswordOpen(true);
              }}
            >
              <Key />
              Cambio de Password
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePassword
        open={isChangePasswordOpen}
        setOpen={setIsChangePasswordOpen}
      />
    </>
  );
}
