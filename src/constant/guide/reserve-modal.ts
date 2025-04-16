import { defaultConfig } from '@/constant/guide/index';

import { Config } from 'driver.js';

export const reserveModalDriver: Config = {
  ...defaultConfig,
  steps: [
    {
      element: '#reserve-modal-date',
      popover: {
        title: '예약 날짜 선택',
        description: '예약을 원하는 날짜를 선택합니다.',
      },
    },
    {
      element: '#reserve-modal-start-time',
      popover: {
        title: '시작 시간 설정',
        description: '예약 시작 시간을 선택합니다.',
      },
    },
    {
      element: '#reserve-modal-end-time',
      popover: {
        title: '종료 시간 설정',
        description: '예약 종료 시간을 선택합니다.',
      },
    },
    {
      element: '#reserve-modal-people',
      popover: {
        title: '사용 인원 입력',
        description: '해당 공간을 사용할 인원을 입력합니다.',
      },
    },
    {
      element: '#reserve-modal-reason',
      popover: {
        title: '예약 목적 작성',
        description: '예약 사유를 간단히 작성해 주세요.',
      },
    },
    {
      element: '#reserve-modal-button',
      popover: {
        title: '예약 제출',
        description: '입력한 정보를 바탕으로 예약을 진행합니다.',
        showButtons: ['close'],
      },
      disableActiveInteraction: false,
    },
  ],
};
