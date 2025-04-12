import { Dispatch, SetStateAction } from 'react';

import { Badge } from '@/component/ui/badge';
import { Button } from '@/component/ui/button';

import { ReservationCancelModalProps } from '@/component/modal/reservation-cancel';
import { ReservationDetailModalProps } from '@/component/modal/reservation-detail';
import { ReturnPictureModalProps } from '@/component/modal/return-picture';
import { UploadReturnPictureModalProps } from '@/component/modal/upload-return-picture';

import { ReservationDto, ReservationStatus } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { cn, reservationStatusName, spaceName } from '@/lib/utils';

import { format, parse } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Clock, Image, ImageUp, MapPin, Trash2, Undo2, Users } from 'lucide-react';

interface ReservationCardProps {
  reservation: ReservationDto;
  setReservation: Dispatch<SetStateAction<ReservationDto[]>>;
}

export default function ReservationCard({ reservation, setReservation }: ReservationCardProps) {
  const { open } = useModalStore();

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-md border p-4 hover:bg-neutral-50"
      onClick={() =>
        open<ReservationDetailModalProps>('reservation-detail', {
          reservation,
        })
      }
    >
      <div className="flex flex-col gap-2 text-sm sm:text-xs">
        <div className="flex items-center gap-2 text-sm sm:text-xs">
          <Badge
            className={
              reservation.status === ReservationStatus.PENDING
                ? 'border-yellow-400 bg-yellow-100/50 text-yellow-700'
                : reservation.status === ReservationStatus.IN_USE
                  ? 'border-green-400 bg-green-100/50 text-green-700'
                  : 'border-red-400 bg-red-100/50 text-red-700'
            }
          >
            {reservationStatusName(reservation.status)}
          </Badge>
          {format(parse(reservation.date, 'yyyy-MM-dd', new Date()), 'MM월 dd일 EEEE', {
            locale: ko,
          })}
        </div>

        <div className="flex items-center gap-1 text-sm sm:text-xs">
          <Clock size={16} className="hidden sm:block" />
          <Clock size={13} className="block sm:hidden" />
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            {format(parse(reservation.startTime, 'HH:mm:ss', new Date()), 'HH시 mm분')}~
            {format(parse(reservation.endTime, 'HH:mm:ss', new Date()), 'HH시 mm분')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-1">
            <MapPin size={16} className="hidden sm:block" />
            <MapPin size={13} className="block sm:hidden" />
            <div className="text-xs sm:text-sm">{spaceName(reservation.space)}</div>
          </div>

          <div className="flex items-center gap-1">
            <Users size={16} className="hidden sm:block" />
            <Users size={13} className="block sm:hidden" />
            <div className="text-xs sm:text-sm">{reservation.participants.length}명</div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className={cn(
          'text-xs sm:text-sm',
          reservation.status === ReservationStatus.PENDING && 'text-red-500 hover:text-red-600',
          reservation.status === ReservationStatus.RETURNED &&
            !reservation.returnPicture &&
            'text-blue-500 hover:text-blue-600',
        )}
        onClick={(e) => {
          e.stopPropagation();

          if (reservation.status === ReservationStatus.PENDING) {
            open<ReservationCancelModalProps>('reservation-cancel', {
              reservation,
              onCancel: (cancelledId) => {
                setReservation((prev) => prev.filter((x) => x.id !== cancelledId));
              },
            });
          } else if (reservation.status === ReservationStatus.IN_USE) {
            open<UploadReturnPictureModalProps>('upload-return-picture', {
              reservation,
              onReturn: (reservation) => {
                setReservation((prev) =>
                  prev.map((x) => (x.id === reservation.id ? reservation : x)),
                );
              },
            });
          } else if (
            reservation.status === ReservationStatus.RETURNED &&
            reservation.returnPicture
          ) {
            open<ReturnPictureModalProps>('return-picture', {
              image: reservation.returnPicture,
            });
          } else {
            open<UploadReturnPictureModalProps>('upload-return-picture', {
              reservation,
              onReturn: (reservation) => {
                setReservation((prev) =>
                  prev.map((x) => (x.id === reservation.id ? reservation : x)),
                );
              },
            });
          }
        }}
      >
        {reservation.status === ReservationStatus.PENDING ? (
          <>
            <Trash2 />
            <span>취소</span>
          </>
        ) : reservation.status === ReservationStatus.IN_USE ? (
          <>
            <Undo2 />
            <span>반납</span>
          </>
        ) : reservation.status === ReservationStatus.RETURNED && reservation.returnPicture ? (
          <>
            <Image />
            <span>사진 보기</span>
          </>
        ) : (
          <>
            <ImageUp />
            <span>사진 올리기</span>
          </>
        )}
      </Button>
    </div>
  );
}
