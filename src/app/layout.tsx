import { ReactNode } from 'react';

import { Metadata } from 'next';

import ClientLayout from '@/app/client-layout';

import '@/style/global.css';

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: 'Tably | 테이블리',
};

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <main>
          <ClientLayout>{children}</ClientLayout>
        </main>
      </body>
    </html>
  );
}
