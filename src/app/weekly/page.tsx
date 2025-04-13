'use client';

import { useCallback, useEffect, useState } from 'react';

import Timetable from '@/app/weekly/_component/timetable';

import { Button } from '@/component/ui/button';
import { Calendar } from '@/component/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/component/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/component/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/component/ui/tabs';

import { ReserveModalProps } from '@/component/modal/reserve';
import { SpaceModalProps } from '@/component/modal/space';

import Api from '@/api';
import { ReservationDto, Space } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { useApi } from '@/hook/use-api';

import { spaceName } from '@/lib/utils';

import {
  addDays,
  endOfDay,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  parse,
  startOfDay,
  startOfWeek,
  subDays,
} from 'date-fns';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export default function Page() {
  const [date, setDate] = useState<DateRange>({
    from: startOfWeek(new Date(), { weekStartsOn: 0 }),
    to: endOfWeek(new Date(), { weekStartsOn: 0 }),
  });
  const [space, setSpace] = useState(Space.TABLE1);
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  const [isApiProcessing, startApi] = useApi();

  const { open } = useModalStore();

  const openReserveModal = useCallback(() => {
    open<SpaceModalProps>('space', {
      onSelect: (space) => {
        close();
        setTimeout(() => {
          open<ReserveModalProps>('reserve', {
            space,
            onReserve: (reservation) => {
              const reservationDate = parse(reservation.date, 'yyyy-MM-dd', new Date());
              if (
                isBefore(reservationDate, startOfDay(date.from!)) ||
                isAfter(reservationDate, endOfDay(date.to!))
              )
                return;
              setReservations((prev) => [...prev, reservation]);
            },
          });
        });
      },
    });
  }, [date]);

  const handleSelect = useCallback(
    (selected: DateRange | undefined) => {
      if (!selected) return;

      if (selected.to && date.to && selected.to.getTime() !== date.to.getTime()) {
        setDate({
          from: startOfWeek(selected.to, { weekStartsOn: 0 }),
          to: endOfWeek(selected.to, { weekStartsOn: 0 }),
        });
      } else {
        setDate({
          from: startOfWeek(selected.from!, { weekStartsOn: 0 }),
          to: endOfWeek(selected.from!, { weekStartsOn: 0 }),
        });
      }
    },
    [date],
  );

  useEffect(() => {
    setReservations([]);
    startApi(async () => {
      const { reservations } = await Api.Domain.Reservation.getWeeklyReservations(
        subDays(date.from!, 1),
        addDays(date.to!, 1),
      );
      setReservations(reservations);
    });
  }, [date]);

  return (
    <div className="flex flex-col gap-4 sm:gap-8">
      <div className="flex w-full items-center justify-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDate((prev) => ({
                from: subDays(prev.from!, 7),
                to: subDays(prev.to!, 7),
              }))
            }
          >
            <ArrowLeft />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant="outline" className="w-[200px] font-normal">
                {format(date.from!, 'MM월 dd일')} ~ {format(date.to!, 'MM월 dd일')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="range" selected={date} onSelect={handleSelect} />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setDate((prev) => ({
                from: addDays(prev.from!, 7),
                to: addDays(prev.to!, 7),
              }))
            }
          >
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

      <Tabs
        value={space}
        onValueChange={(value) => setSpace(value as Space)}
        className="hidden overflow-x-auto sm:block"
      >
        <TabsList>
          {Object.keys(Space).map((space) => (
            <TabsTrigger key={space} value={space}>
              {spaceName(space)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <DropdownMenu>
        <DropdownMenuTrigger className="asChild block self-end sm:hidden">
          <Button variant="outline" className="text-xs">
            {spaceName(space)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.keys(Space).map((space) => (
            <DropdownMenuItem
              key={space}
              className="text-xs"
              onClick={() => setSpace(space as Space)}
            >
              {spaceName(space)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Timetable date={date} space={space} reservations={reservations} loading={isApiProcessing} />
    </div>
  );
}
