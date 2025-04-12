'use client';

import Image from 'next/image';
import Link from 'next/link';

import InfoCard from '@/app/auth/login/_component/info-card';
import { infos } from '@/app/auth/login/_constant/info';

import { Button } from '@/component/ui/button';

import SoftwareLogo from '@/public/software.png';
import TablyLogo from '@/public/tably.png';

import { LogIn } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center">
        <Image src={SoftwareLogo} alt="software" width={200} height={200} priority />
        <Image src={TablyLogo} alt="tably" width={140} height={65} priority />
        <p className="text-gray-600">국민대 소융대 동아리 공용 공간 대여 서비스</p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
          {infos.map((info) => (
            <InfoCard key={info.title} info={info} />
          ))}
        </div>

        <Link href="/auth/oauth">
          <Button className="flex w-full items-center py-6" size="lg">
            <LogIn />
            구글 계정으로 시작하기
          </Button>
        </Link>
      </div>
    </div>
  );
}
