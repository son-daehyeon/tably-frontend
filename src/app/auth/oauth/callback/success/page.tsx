'use client';

import { useEffect } from 'react';

import { redirect } from 'next/navigation';

import Api from '@/api';

import { parseAsBoolean, useQueryState } from 'nuqs';

export default function Page() {
  const [token] = useQueryState('token');
  const [isNewUser] = useQueryState('isNewUser', parseAsBoolean);

  useEffect(() => {
    (async () => {
      if (token) {
        await Api.Request.setToken(token);
      }

      redirect(isNewUser ? '/auth/sign-up/' : '/');
    })();
  }, []);
}
