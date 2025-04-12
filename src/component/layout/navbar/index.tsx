'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { menuItems } from '@/constant/menu-item';

import { cn } from '@/lib/utils';

export default function MobileNavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 border-t bg-white sm:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex h-14 justify-evenly">
        {menuItems.map((item) => (
          <Link
            key={item.link}
            href={item.link}
            className={cn(
              'flex flex-1 flex-col items-center justify-center transition-colors',
              item.link === pathname ? 'text-black' : 'text-neutral-500 hover:text-neutral-700',
            )}
          >
            <item.icon className="mb-1 h-5 w-5" />
            <span className="text-xs">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
