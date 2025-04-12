'use client';

import { ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useInitStore } from '@/store/init.store';
import { useUserStore } from '@/store/user.store';

interface AnonymousGuardProps {
  children: ReactNode;
}

export default function AnonymousGuard({ children }: AnonymousGuardProps) {
  const router = useRouter();

  const { isInit } = useInitStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (!isInit || !user) return;
    router.replace('/');
  }, [isInit, user]);

  if (!isInit || user) return null;

  return children;
}
