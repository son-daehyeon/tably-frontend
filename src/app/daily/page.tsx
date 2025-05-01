'use client';

import { useCallback, useEffect, useState } from 'react';

import Timetable from '@/app/daily/_component/timetable';

import { Button } from '@/component/ui/button';
import { Calendar } from '@/component/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/component/ui/popover';

import { ReserveModalProps } from '@/component/modal/reserve';
import { SpaceModalProps } from '@/component/modal/space';

import { dailyMockReservations, driver } from '@/constant/guide';
import { dailyDriver } from '@/constant/guide/daily';

import Api from '@/api';
import { ReservationDto } from '@/api/types/reservation';

import { useGuideStore } from '@/store/guide.store';
import { useModalStore } from '@/store/modal.store';

import { useApi } from '@/hook/use-api';

import { addDays, format, isSameDay, parse, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { useQueryState } from 'nuqs';

export default function Page() {
  const [date, setDate] = useQueryState('date', {
    defaultValue: format(new Date(), 'yyyy-MM-dd'),
    history: 'push',
    clearOnDefault: false,
  });
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  const [isApiProcessing, startApi] = useApi();

  const { showGuide } = useGuideStore();
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
    if (showGuide) return;

    startApi(async () => {
      const { reservations } = await Api.Domain.Reservation.getDailyReservations(
        parse(date, 'yyyy-MM-dd', new Date()),
      );
      setReservations(reservations);
    });
  }, [showGuide, date]);

  useEffect(() => {
    if (!showGuide) return;
    driver.setConfig(dailyDriver);
    driver.drive();
    setReservations(dailyMockReservations);
  }, [showGuide]);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex w-full items-center justify-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDate((prev) =>
                format(subDays(parse(prev, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd'),
              )
            }
          >
            <ArrowLeft />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] font-normal" id="calendar">
                {format(date, 'yyyy년 MM월 dd일 (E)', { locale: ko })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={parse(date, 'yyyy-MM-dd', new Date())}
                onSelect={(value) => value && setDate(format(value, 'yyyy-MM-dd'))}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDate((prev) =>
                format(addDays(parse(prev, 'yyyy-MM-dd', new Date()), 1), 'yyyy-MM-dd'),
              )
            }
          >
            <ArrowRight />
          </Button>
        </div>
        <Button
          id="reservation-button"
          variant="default"
          className="fixed right-6 bottom-20 z-10 sm:static"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
          onClick={openReserveModal}
        >
          <Plus />
          예약하기
        </Button>
      </div>

      <Timetable
        date={parse(date, 'yyyy-MM-dd', new Date())}
        reservations={reservations}
        loading={isApiProcessing}
      />
    </div>
  );
}
