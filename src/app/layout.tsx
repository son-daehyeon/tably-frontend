'use client';

import { ReactNode, Suspense, useEffect, useMemo } from 'react';

import { usePathname } from 'next/navigation';

import Header from '@/component/layout/header';
import ModalContainer from '@/component/layout/modal-container';
import NavBar from '@/component/layout/navbar';

import { Toaster } from '@/component/ui/sonner';

import Api from '@/api';

import { useInitStore } from '@/store/init.store';

import AnonymousGuard from '@/lib/guard/anonymous.guard';
import UserGuard from '@/lib/guard/user.guard';

import '@/style/global.css';

import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface LayoutProps {
  children: ReactNode;
}

const ANONYMOUS_PAGE = [
  '/auth/login',
  '/auth/oauth',
  '/auth/oauth/callback/success',
  '/auth/oauth/callback/failure',
];

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const { isInit, setInit } = useInitStore();

  const anonymous = useMemo(() => ANONYMOUS_PAGE.includes(pathname), [pathname]);
  const isRenderAdditionalComponent = useMemo(
    () => !anonymous && pathname !== '/auth/sign-up',
    [anonymous, pathname],
  );

  const Guard = useMemo(() => (anonymous ? AnonymousGuard : UserGuard), [anonymous]);

  useEffect(() => {
    setInit(false);

    (async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await Api.Request.setToken(token);
      }

      setInit(true);
    })();
  }, []);

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <main>
          <Suspense>
            <NuqsAdapter>
              {isInit && (
                <Guard>
                  {isRenderAdditionalComponent && <Header />}

                  <div className="mx-auto max-h-[100dvh] max-w-2xl px-4">
                    <div className={isRenderAdditionalComponent ? 'py-18 sm:pb-8' : ''}>
                      {children}
                    </div>
                  </div>
                  {isRenderAdditionalComponent && <NavBar />}
                </Guard>
              )}
            </NuqsAdapter>

            <ModalContainer />

            <Toaster
              className="font-sans"
              position="bottom-right"
              duration={3000}
              closeButton={true}
              theme="light"
            />
          </Suspense>
        </main>
      </body>
    </html>
  );
}
