import Link from 'next/link';

import { Button } from '@/component/ui/button';

import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-8">
      <div className="rounded-full bg-blue-100 p-4">
        <Search className="size-10 text-blue-500" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-2xl font-bold">페이지를 찾을 수 없습니다.</h1>

        <p>요청하신 페이지가 존재하지 않거나 삭제되었습니다.</p>
      </div>

      <Button variant="outline" asChild>
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  );
}
