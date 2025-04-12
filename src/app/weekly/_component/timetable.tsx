'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Skeleton } from '@/component/ui/skeleton';

import { ReservationDetailModalProps } from '@/component/modal/reservation-detail';

import { ReservationDto, ReservationStatus, Space } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { cn } from '@/lib/utils';

import { eachDayOfInterval, format, isSameDay, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

interface WeeklyTimetableProps {
  date: DateRange;
  space: Space;
  reservations: ReservationDto[];
  loading: boolean;
}

export default function WeeklyTimetable({
  date,
  space,
  reservations,
  loading,
}: WeeklyTimetableProps) {
  const timeColumnWidth = 40;
  const dayMinWidth = 80;

  const [containerWidth, setContainerWidth] = useState(0);

  const { open } = useModalStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const days = useMemo(() => eachDayOfInterval({ start: date.from!, end: date.to! }), [date]);

  const computedColumnWidth = useMemo(
    () =>
      containerWidth > timeColumnWidth + days.length * dayMinWidth
        ? (containerWidth - timeColumnWidth) / days.length
        : dayMinWidth,
    [days, containerWidth],
  );

  const getMinutes = useCallback((t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.clientWidth);
    };

    updateWidth();

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto overflow-y-hidden" ref={containerRef}>
        <div style={{ width: '100%', minWidth: timeColumnWidth + 7 * dayMinWidth }}>
          <div className="mb-2 flex">
            <div className="flex-shrink-0" style={{ width: `${timeColumnWidth}px` }} />
            {days.map((day, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-center text-sm font-medium"
                style={{ width: computedColumnWidth }}
              >
                {format(day, 'E', { locale: ko })}
              </div>
            ))}
          </div>
          <div className="flex">
            <div className="relative flex-shrink-0" style={{ width: `${timeColumnWidth}px` }}>
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="absolute text-xs text-neutral-700"
                  style={{
                    top: `${i * 60 - (i === 0 ? 0 : i === 15 ? 16 : 8)}px`,
                  }}
                >
                  {String(9 + i).padStart(2, '0')}:00
                </div>
              ))}
            </div>
            <div
              className="relative"
              style={{
                width: computedColumnWidth * 7,
                height: `${24 * 60 - 9 * 60}px`,
              }}
            >
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-neutral-200"
                  style={{ top: `${i * 60}px` }}
                />
              ))}
              {loading
                ? Array.from({ length: 7 }).map((_, idx) => {
                    const start = Math.floor(Math.random() * (1080 - 540 + 1)) + 540;
                    const end = start + 120;

                    return (
                      <Skeleton
                        key={idx}
                        className="absolute"
                        style={{
                          top: `${start - 540}px`,
                          height: `${end - start}px`,
                          left: `${idx * computedColumnWidth + 2}px`,
                          width: `${computedColumnWidth - 4}px`,
                        }}
                      />
                    );
                  })
                : reservations
                    .filter((reservation) => reservation.space === space)
                    .map((reservation) => {
                      const reservationDate = parseISO(reservation.date);
                      const dayIndex = days.findIndex((day) => isSameDay(day, reservationDate));
                      const start = getMinutes(reservation.startTime);
                      const end = getMinutes(reservation.endTime);
                      return (
                        <div
                          key={reservation.id}
                          className={cn(
                            'absolute flex cursor-pointer flex-col justify-between rounded-md border p-1',
                            reservation.status === ReservationStatus.PENDING
                              ? 'border-yellow-400 bg-yellow-100/50 text-yellow-700'
                              : reservation.status === ReservationStatus.IN_USE
                                ? 'border-green-400 bg-green-100/50 text-green-700'
                                : 'border-red-400 bg-red-100/50 text-red-700',
                          )}
                          style={{
                            top: `${start - 540}px`,
                            height: `${end - start}px`,
                            left: `${dayIndex * computedColumnWidth + 2}px`,
                            width: `${computedColumnWidth - 4}px`,
                          }}
                          onClick={() =>
                            open<ReservationDetailModalProps>('reservation-detail', { reservation })
                          }
                        >
                          <div className="text-sm font-bold">{reservation.club}</div>
                        </div>
                      );
                    })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
