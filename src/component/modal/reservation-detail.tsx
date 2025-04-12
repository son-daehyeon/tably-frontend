import { DialogDescription, DialogHeader, DialogTitle } from '@/component/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/component/ui/table';

import { ReturnPictureModalProps } from '@/component/modal/return-picture';

import { ReservationDto } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { clubName, reservationStatusName, spaceName } from '@/lib/utils';

import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface ReservationDetailModalProps {
  reservation: ReservationDto;
}

export default function ReservationDetailModal({ reservation }: ReservationDetailModalProps) {
  const { open, close } = useModalStore();

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
              {format(parse(reservation.startTime, 'HH:mm:ss', new Date()), 'HH시 mm분')}
              <span className="mx-1">~</span>
              {format(parse(reservation.endTime, 'HH:mm:ss', new Date()), 'HH시 mm분')}
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
              <TableHead className="font-medium">반납 일자</TableHead>
              <TableCell
                className={
                  reservation.returnPicture ? 'cursor-pointer text-blue-600 hover:underline' : ''
                }
                onClick={() => {
                  if (!reservation.returnPicture) return;

                  close();
                  setTimeout(() =>
                    open<ReturnPictureModalProps>('return-picture', {
                      image: reservation.returnPicture!,
                    }),
                  );
                }}
              >
                {format(new Date(reservation.returnedAt), 'HH시 mm분')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
