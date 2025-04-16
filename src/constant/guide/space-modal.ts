import { defaultConfig } from '@/constant/guide/index';

import { Config } from 'driver.js';

export const spaceModalDriver: Config = {
  ...defaultConfig,
  steps: [
    {
      element: '#space-modal',
      popover: {
        title: '테이블 선택',
        description: '공용 공관(예술관 225호)에서 사용할 테이블을 선택할 수 있습니다.',
      },
    },
    {
      element: '#space-block-TABLE4',
      popover: {
        title: '테스트 예약',
        description: '예시로 테이블 4번 공간을 예약해봅니다.',
        showButtons: ['close'],
      },
      disableActiveInteraction: false,
    },
  ],
};
