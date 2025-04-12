import { z } from 'zod';

// ======================================== Enum ========================================
export enum Club {
  WINK = 'WINK',
  KOSS = 'KOSS',
  AIM = 'AIM',
  KPSC = 'KPSC',
  KOBOT = 'KOBOT',
  D_ALPHA = 'D_ALPHA',
  DO_UM = 'DO_UM',
  FOSCAR = 'FOSCAR',
}
// ======================================== Enum ========================================

// ======================================== Internal ========================================
export interface UserDto {
  id: string;
  club: Club;
  name: string;
}
// ======================================== Internal ========================================

// ======================================== Request ========================================
export const SignUpRequestSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  club: z.nativeEnum(Club, {
    errorMap: () => ({ message: '동아리를 선택해주세요.' }),
  }),
});

export const UpdateClubRequestSchema = z.object({
  club: z.nativeEnum(Club, {
    errorMap: () => ({ message: '동아리를 선택해주세요.' }),
  }),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type UpdateClubRequest = z.infer<typeof UpdateClubRequestSchema>;
// ======================================== Request ========================================

// ======================================== Response ========================================
export interface UserResponse {
  user: UserDto;
}

export interface UsersResponse {
  users: UserDto[];
}
// ======================================== Response ========================================
