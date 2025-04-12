'use client';

import { oauthErrorCode } from '@/app/auth/oauth/callback/failure/_constant/oauth-error-code';

import { useQueryState } from 'nuqs';

export default function Page() {
  const [code] = useQueryState('code');

  throw new Error(
    code && code in oauthErrorCode ? oauthErrorCode[code] : '잘못된 Oauth 실패 코드입니다.',
  );
}
