import Image from 'next/image';

import { DialogDescription, DialogHeader, DialogTitle } from '@/component/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/component/ui/table';

import { ReservationDto } from '@/api/types/reservation';

import { clubName, reservationStatusName, spaceName } from '@/lib/utils';

import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface ReservationDetailModalProps {
  reservation: ReservationDto;
}

export default function ReservationDetailModal({ reservation }: ReservationDetailModalProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>예약 조회</DialogTitle>
        <DialogDescription>{reservationStatusName(reservation.status)}</DialogDescription>
      </DialogHeader>

      <Table>
        <TableBody>
          <TableRow>
            <TableHead className="w-[80px] font-medium">사용 동아리</TableHead>
            <TableCell>{clubName(reservation.club)}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">사용 인원</TableHead>
            <TableCell>{reservation.participants.map((user) => user.name).join(', ')}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">사용 일자</TableHead>
            <TableCell>
              {format(parse(reservation.date, 'yyyy-MM-dd', new Date()), 'yyyy년 MM월 dd일 EEEE', {
                locale: ko,
              })}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">사용 기간</TableHead>
            <TableCell>
              {format(parse(reservation.startTime, 'HH:mm:ss', new Date()), 'HH:mm')}
              <span className="mx-1">~</span>
              {format(parse(reservation.endTime, 'HH:mm:ss', new Date()), 'HH:mm')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">사용 공간</TableHead>
            <TableCell>{spaceName(reservation.space)}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-medium">사용 목적</TableHead>
            <TableCell>{reservation.reason}</TableCell>
          </TableRow>
          {reservation.returnedAt && (
            <TableRow>
              <TableHead className="font-medium">반납 시간</TableHead>
              <TableCell>{format(new Date(reservation.returnedAt), 'HH:mm')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {reservation.returnPicture && (
        <div className="flex items-center justify-center">
          <Image
            src={reservation.returnPicture}
            alt="반납 사진"
            width={250}
            height={250}
            unoptimized
            className="aspect-video rounded-md object-cover"
          />
        </div>
      )}
    </>
  );
}
