'use client';

import { useEffect } from 'react';

import { Button } from '@/component/ui/button';

import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface PageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Page({ error, reset }: PageProps) {
  useEffect(() => {
    toast.error(error.message || '오류가 발생했습니다');
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="rounded-full bg-red-100 p-4">
        <AlertTriangle className="size-10 text-red-500" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-2xl font-bold">오류가 발생했습니다.</h1>

        <p>{error.message || '알 수 없는 오류가 발생했습니다.'}</p>
      </div>

      <Button variant="outline" onClick={reset}>
        <RefreshCcw className="h-4 w-4" />
        다시 시도하기
      </Button>
    </div>
  );
}
