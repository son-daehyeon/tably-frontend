'use client';

import { useCallback, useEffect, useState } from 'react';

import Timetable from '@/app/daily/_component/timetable';

import { Button } from '@/component/ui/button';
import { Calendar } from '@/component/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/component/ui/popover';

import { ReserveModalProps } from '@/component/modal/reserve';
import { SpaceModalProps } from '@/component/modal/space';

import Api from '@/api';
import { ReservationDto } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { useApi } from '@/hook/use-api';

import { addDays, format, isSameDay, parse, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

export default function Page() {
  const [date, setDate] = useState<Date>(new Date());
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  const [isApiProcessing, startApi] = useApi();

  const { open, close } = useModalStore();

  const openReserveModal = useCallback(() => {
    open<SpaceModalProps>('space', {
      onSelect: (space) => {
        close();
        setTimeout(() => {
          open<ReserveModalProps>('reserve', {
            space,
            onReserve: (reservation) => {
              if (!isSameDay(parse(reservation.date, 'yyyy-MM-dd', new Date()), date)) return;
              setReservations((prev) => [...prev, reservation]);
            },
          });
        });
      },
    });
  }, [date]);

  useEffect(() => {
    setReservations([]);
    startApi(async () => {
      const { reservations } = await Api.Domain.Reservation.getDailyReservations(date);
      setReservations(reservations);
    });
  }, [date]);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex w-full items-center justify-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setDate((prev) => subDays(prev, 1))}>
            <ArrowLeft />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] font-normal">
                {format(date, 'yyyy년 MM월 dd일 (E)', { locale: ko })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(value) => value && setDate(value)}
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={() => setDate((prev) => addDays(prev, 1))}>
            <ArrowRight />
          </Button>
        </div>
        <Button
          variant="default"
          className="fixed right-6 bottom-20 z-10 sm:static"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          onClick={openReserveModal}
        >
          <Plus />
          예약하기
        </Button>
      </div>

      <Timetable date={date} reservations={reservations} loading={isApiProcessing} />
    </div>
  );
}
