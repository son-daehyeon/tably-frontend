'use client';

import { ComponentType, useEffect, useState } from 'react';

import dynamic from 'next/dynamic';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/component/ui/dialog';

import { useModalStore } from '@/store/modal.store';

export default function ModalContainer() {
  const { modal, close, props } = useModalStore();
  const [ModalComponent, setModalComponent] = useState<ComponentType<unknown> | null>(null);

  useEffect(() => {
    if (!modal) {
      setModalComponent(null);
      return;
    }

    (async () => {
      const Component = dynamic(
        () => import(`@/component/modal/${modal.replaceAll(':', '/')}.tsx`),
        {
          loading: () => (
            <>
              <DialogHeader>
                <DialogTitle>불러오는 중...</DialogTitle>
              </DialogHeader>
              <div className="h-20" />
            </>
          ),
          ssr: false,
        },
      );

      setModalComponent(() => Component as ComponentType<unknown>);
    })();
  }, [modal]);

  if (!ModalComponent) return null;

  return (
    <Dialog open={!!modal} onOpenChange={(value) => !value && close()}>
      <DialogContent>
        <ModalComponent {...(props || {})} />
      </DialogContent>
    </Dialog>
  );
}
