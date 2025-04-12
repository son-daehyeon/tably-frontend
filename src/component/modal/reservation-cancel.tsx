import { useCallback } from 'react';

import { Button } from '@/component/ui/button';
import { DialogDescription, DialogHeader, DialogTitle } from '@/component/ui/dialog';

import Api from '@/api';
import { ReservationDto } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { useApiWithToast } from '@/hook/use-api';

export interface ReservationCancelModalProps {
  reservation: ReservationDto;
  onCancel: (cancelledId: string) => void;
}

export default function ReservationCancelModal({
  reservation,
  onCancel,
}: ReservationCancelModalProps) {
  const { close } = useModalStore();

  const [isApiProcessing, startApi] = useApiWithToast();

  const cancelReservation = useCallback((reservation: ReservationDto) => {
    startApi(
      async () => {
        await Api.Domain.Reservation.cancelReservation(reservation.id);
        onCancel(reservation.id);
      },
      {
        loading: '예약을 취소하고 있습니다.',
        success: '예약이 취소했습니다.',
        finally: close,
      },
    );
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle>예약 취소</DialogTitle>
        <DialogDescription>정말로 예약을 취소하시겠습니까?</DialogDescription>
      </DialogHeader>

      <Button
        variant="destructive"
        disabled={isApiProcessing}
        onClick={() => cancelReservation(reservation)}
      >
        취소하기
      </Button>
    </>
  );
}
