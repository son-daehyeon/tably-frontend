import { redirect } from 'next/navigation';

import { ReservationDto, ReservationStatus, Space } from '@/api/types/reservation';
import { Club, UserDto } from '@/api/types/user';

import { useGuideStore } from '@/store/guide.store';

import { format } from 'date-fns';
import { Config, Driver, driver as _driver } from 'driver.js';

export const driver: Driver = _driver();

export const defaultConfig: Config = {
  nextBtnText: '다음',
  prevBtnText: '이전',
  doneBtnText: '종료',
  allowKeyboardControl: false,
  overlayClickBehavior: undefined,
  disableActiveInteraction: true,
  onCloseClick: () => {
    driver.destroy();
    useGuideStore.getState().setShowGuide(false);
    redirect('/daily');
  },
};

const ut: UserDto = {
  id: 'ut',
  club: Club.WINK,
  name: '가이드',
};

const u1: UserDto = {
  id: 'u1',
  club: Club.WINK,
  name: '손대현',
};

const u2: UserDto = {
  id: 'u2',
  club: Club.WINK,
  name: '박건민',
};

const u3: UserDto = {
  id: 'u3',
  club: Club.WINK,
  name: '황수민',
};

export const dailyMockReservations: ReservationDto[] = [
  generateReservation(
    'r1',
    [u1, u2],
    Space.TABLE1,
    '10:30:00',
    '12:00:00',
    '테스트',
    ReservationStatus.IN_USE,
  ),
  generateReservation(
    'r2',
    [u2, u1, u3],
    Space.TABLE2,
    '13:00:00',
    '15:00:00',
    '테스트',
    ReservationStatus.RETURNED,
    {
      returnPicture: 'a',
      returnedAt: generateReturnedAt(14, 45),
    },
  ),
  generateReservation(
    'r3',
    [u3, u2],
    Space.TABLE3,
    '11:30:00',
    '13:30:00',
    '테스트',
    ReservationStatus.RETURNED,
  ),
];

export const myMockReservations: ReservationDto[] = [
  generateReservation(
    'my-reservation-mock-1',
    [ut],
    Space.TABLE1,
    '09:00:00',
    '10:30:00',
    '테스트',
    ReservationStatus.RETURNED,
    {
      returnPicture: null,
      returnedAt: generateReturnedAt(10, 30),
    },
  ),
  generateReservation(
    'my-reservation-mock-2',
    [ut],
    Space.TABLE2,
    '10:30:00',
    '12:00:00',
    '테스트',
    ReservationStatus.RETURNED,
    {
      returnPicture: 'a',
      returnedAt: generateReturnedAt(11, 50),
    },
  ),
  generateReservation(
    'my-reservation-mock-3',
    [ut],
    Space.TABLE3,
    '13:00:00',
    '14:00:00',
    '테스트',
    ReservationStatus.IN_USE,
  ),
  generateReservation(
    'my-reservation-mock-4',
    [ut],
    Space.TABLE4,
    '15:00:00',
    '16:00:00',
    '테스트',
    ReservationStatus.PENDING,
  ),
];

function generateReservation(
  id: string,
  participants: UserDto[],
  space: Space,
  startTime: string,
  endTime: string,
  reason: string,
  status: ReservationStatus,
  other?: Record<string, unknown>,
): ReservationDto {
  return {
    id,
    participants,
    club: Club.WINK,
    space,
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime,
    endTime,
    reason,
    status,
    ...other,
  } as ReservationDto;
}

function generateReturnedAt(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 30, 0);
  return date.toISOString();
}
