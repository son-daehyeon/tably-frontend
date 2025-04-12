'use client';

import { ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useInitStore } from '@/store/init.store';
import { useUserStore } from '@/store/user.store';

interface UserGuardProps {
  children: ReactNode;
}

export default function UserGuard({ children }: UserGuardProps) {
  const router = useRouter();

  const { isInit } = useInitStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!isInit) return;
    if (user && !user?.name) {
      router.replace('/auth/sign-up');
      return;
    }
    if (user) return;
    router.replace('/auth/login');
  }, [isInit, user]);

  if (!isInit || !user) return null;

  return children;
}
