import { ReservationStatus, Space } from '@/api/types/reservation';
import { Club } from '@/api/types/user';

import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLocalDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function toLocalTime(date: Date) {
  return format(date, 'HH:mm');
}

export function clubName(club: string) {
  switch (club) {
    case Club.WINK:
      return 'WINK';
    case Club.KOSS:
      return 'KOSS';
    case Club.AIM:
      return 'AIM';
    case Club.KPSC:
      return 'KPSC';
    case Club.KOBOT:
      return 'KOBOT';
    case Club.D_ALPHA:
      return 'D-Alpha';
    case Club.DO_UM:
      return 'Do-Um';
    case Club.FOSCAR:
      return 'FOSCAR';
  }
}

export function spaceName(space: string) {
  switch (space) {
    case Space.TABLE1:
      return '테이블1';
    case Space.TABLE2:
      return '테이블2';
    case Space.TABLE3:
      return '테이블3';
    case Space.TABLE4:
      return '테이블4';
    case Space.ROBOT_FIELD:
      return '경기장';
  }
}

export function reservationStatusName(status: string) {
  switch (status) {
    case ReservationStatus.PENDING:
      return '대기중';
    case ReservationStatus.IN_USE:
      return '사용중';
    case ReservationStatus.RETURNED:
      return '반납됨';
  }
}
