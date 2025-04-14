import { Club, UserDto } from '@/api/types/user';
import { LocalDatePattern, LocalTimePattern } from '@/api/validation';

import { z } from 'zod';

// ======================================== Enum ========================================
export enum ReservationStatus {
  PENDING = 'PENDING',
  IN_USE = 'IN_USE',
  RETURNED = 'RETURNED',
}

export enum Space {
  TABLE1 = 'TABLE1',
  TABLE2 = 'TABLE2',
  TABLE3 = 'TABLE3',
  TABLE4 = 'TABLE4',
  ROBOT_FIELD = 'ROBOT_FIELD',
}
// ======================================== Enum ========================================

// ======================================== Internal DTO ========================================
export interface ReservationDto {
  id: string;
  participants: UserDto[];
  club: Club;
  space: Space;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: ReservationStatus;
  returnPicture: string | null;
  returnedAt: string | null;
}
// ======================================== Internal ========================================

// ======================================== Request ========================================
export const ReservationRequestSchema = z
  .object({
    participants: z
      .array(z.string().min(1, '한 글자 이상 입력해주세요.'))
      .min(1, '한 명 이상 선택해야 합니다.'),
    space: z.nativeEnum(Space, {
      errorMap: () => ({ message: '공간을 선택해주세요.' }),
    }),
    date: z.string().regex(LocalDatePattern, '올바른 날짜 형태가 아닙니다.'),
    startTime: z
      .string()
      .regex(LocalTimePattern, '올바른 시간 형태가 아닙니다.')
      .refine((time) => {
        const minute = parseInt(time.split(':')[1]);
        return minute % 10 === 0;
      }, '10분 단위로 입력해주세요.')
      .refine((time) => {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute;
        return totalMinutes >= 9 * 60; // 09:00 이상
      }, '시작 시간은 09:00 이상이어야 합니다.'),
    endTime: z
      .string()
      .regex(LocalTimePattern, '올바른 시간 형태가 아닙니다.')
      .refine((time) => {
        const minute = parseInt(time.split(':')[1]);
        return minute % 10 === 0;
      }, '10분 단위로 입력해주세요.')
      .refine((time) => {
        const [hour, minute] = time.split(':').map(Number);
        const totalMinutes = hour * 60 + minute;
        return totalMinutes <= 23 * 60; // 23:00 이하
      }, '종료 시간은 23:00 이하여야 합니다.'),
    reason: z.string().min(1, '사유를 입력해주세요.'),
  })
  .refine(
    (data) => {
      const start = data.startTime;
      const end = data.endTime;

      const [startHour, startMinute] = start.split(':').map(Number);
      const [endHour, endMinute] = end.split(':').map(Number);

      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;

      return endTotal > startTotal;
    },
    {
      message: '종료 시간은 시작 시간보다 늦어야 합니다.',
      path: ['endTime'],
    },
  );

export type ReservationRequest = z.infer<typeof ReservationRequestSchema>;
// ======================================== Request ========================================

// ======================================== Response ========================================
export interface ReservationResponse {
  reservation: ReservationDto;
}

export interface ReservationsResponse {
  reservations: ReservationDto[];
}
// ======================================== Response ========================================
