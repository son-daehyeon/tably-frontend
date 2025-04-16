import { redirect } from 'next/navigation';

import { defaultConfig, driver } from '@/constant/guide/index';

import { useGuideStore } from '@/store/guide.store';

import { Config } from 'driver.js';

export const myReservationsDriver: Config = {
  ...defaultConfig,
  steps: [
    {
      element: '#my-reservation-tab-active',
      popover: {
        title: '진행중인 예약',
        description: '현재 예약되었거나 사용 중인 공간을 확인할 수 있습니다.',
      },
    },
    {
      element: '#my-reservation-mock-3',
      popover: {
        title: '사용중인 예약',
        description: '지금 사용 중인 공간입니다. 필요시 조기 반납할 수 있습니다.',
      },
    },
    {
      element: '#my-reservation-mock-4',
      popover: {
        title: '대기중인 예약',
        description: '시작 전 상태의 예약입니다. 예약을 취소할 수 있습니다.',
      },
    },
    {
      element: '#my-reservation-tab-previous',
      popover: {
        title: '지난 예약',
        description: '이미 반납이 완료된 예약 내역입니다.',
        showButtons: ['close'],
      },
      disableActiveInteraction: false,
    },
    {
      element: '#my-reservation-mock-1',
      popover: {
        title: '자동 반납된 예약',
        description: '예약 시간이 종료되어 자동으로 반납된 예약입니다.',
      },
    },
    {
      element: '#my-reservation-mock-2',
      popover: {
        title: '수동 반납된 예약',
        description: '직접 반납을 완료한 예약입니다.',
        onNextClick: () => {
          driver.destroy();
          useGuideStore.getState().setShowGuide(false);
          redirect('/daily');
        },
      },
    },
  ],
};
