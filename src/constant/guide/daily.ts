import { defaultConfig } from '@/constant/guide/index';

import { Config } from 'driver.js';

export const dailyDriver: Config = {
  ...defaultConfig,
  steps: [
    {
      element: '#calendar',
      popover: {
        title: '날짜 선택하기',
        description: '예약 현황을 확인할 날짜를 선택합니다.',
      },
    },
    {
      element: '#timetable',
      popover: {
        title: '시간표 확인',
        description: '선택한 날짜의 전체 예약 현황을 확인할 수 있습니다.',
      },
    },
    {
      element: '#r1',
      popover: {
        title: '사용 중 / 예약 완료',
        description: '흰색 배경은 현재 사용 중이거나 예약된 공간입니다.',
      },
    },
    {
      element: '#r2',
      popover: {
        title: '수동 반납 완료',
        description: '예약자가 직접 반납한 경우를 나타냅니다.',
      },
    },
    {
      element: '#r3',
      popover: {
        title: '자동 반납 완료',
        description: '예약 시간이 지나 자동으로 반납된 상태입니다.',
      },
    },
    {
      element: '#reservation-button',
      popover: {
        title: '예약하러 가기',
        description: '예약 폼으로 이동합니다.',
        showButtons: ['close'],
      },
      disableActiveInteraction: false,
    },
  ],
};
