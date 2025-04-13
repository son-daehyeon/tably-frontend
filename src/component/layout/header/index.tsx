'use client';

import { useCallback } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/component/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/component/ui/dropdown-menu';

import { menuItems } from '@/constant/menu-item';

import Api from '@/api';
import { Club } from '@/api/types/user';

import { useUserStore } from '@/store/user.store';

import { useApiWithToast } from '@/hook/use-api';

import { clubName } from '@/lib/utils';

import TablyLogo from '@/public/tably.png';

import { Check, LogOut, User } from 'lucide-react';
import colors from 'tailwindcss/colors';

export default function Header() {
  const pathname = usePathname();

  const { user, setUser } = useUserStore();

  const [, startApi] = useApiWithToast();

  const changeClub = useCallback((club: Club) => {
    startApi(
      async () => {
        const { user } = await Api.Domain.User.updateClub({ club });
        setUser(user);
      },
      {
        loading: '동아리를 변경하고 있습니다.',
        success: '동아리를 변경했습니다.',
      },
    );
  }, []);

  if (!user) return null;

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-center border-b bg-white">
      <div className="flex w-2xl items-center justify-between px-4">
        <Link href="/">
          <Image
            src={TablyLogo}
            alt="tably"
            width={68}
            height={32}
            priority
            className="h-[24px] w-[50px] sm:h-[32px] sm:w-[68px]"
          />
        </Link>

        <nav className="hidden gap-2 sm:flex">
          {menuItems.map((item) => (
            <Link key={item.link} href={item.link}>
              <Button
                variant={item.link === pathname ? 'default' : 'ghost'}
                className="text-[13px]"
              >
                <item.icon />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-xs sm:text-sm">
              <User className="size-3.5 sm:size-4" />
              <div className="flex gap-1">
                {user.name}
                <span className="text-xs text-neutral-500 sm:text-sm">({clubName(user.club)})</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>동아리</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {Object.keys(Club).map((club) => (
                    <DropdownMenuItem
                      key={club}
                      className="justify-between"
                      onClick={() => changeClub(club as Club)}
                    >
                      {clubName(club)}
                      {club === user.club && <Check />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex text-red-500"
              onClick={() => Api.Request.removeToken()}
            >
              <LogOut color={colors.red['500']} />
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
