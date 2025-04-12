import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Skeleton } from '@/component/ui/skeleton';

import { ReservationDetailModalProps } from '@/component/modal/reservation-detail';

import { ReservationDto, Space } from '@/api/types/reservation';

import { useModalStore } from '@/store/modal.store';

import { spaceName } from '@/lib/utils';

import { format } from 'date-fns';

interface TimetableProps {
  date: Date;
  reservations: ReservationDto[];
  loading: boolean;
}

export default function Timetable({ date, reservations, loading }: TimetableProps) {
  const timeColumnWidth = 40;
  const spaceMinWidth = 80;

  const [containerWidth, setContainerWidth] = useState(0);

  const { open } = useModalStore();

  const containerRef = useRef<HTMLDivElement>(null);

  const computedColumnWidth = useMemo(
    () =>
      containerWidth > timeColumnWidth + Object.keys(Space).length * spaceMinWidth
        ? (containerWidth - timeColumnWidth) / Object.keys(Space).length
        : spaceMinWidth,
    [containerWidth],
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
        <div
          style={{
            width: '100%',
            minWidth: `${timeColumnWidth + Object.keys(Space).length * spaceMinWidth}px`,
          }}
        >
          <div className="mb-2 flex">
            <div className="flex-shrink-0" style={{ width: `${timeColumnWidth}px` }} />
            {Object.keys(Space).map((space) => (
              <div
                key={space}
                className="flex-shrink-0 text-center text-sm font-medium"
                style={{ width: `${computedColumnWidth}px` }}
              >
                {spaceName(space)}
              </div>
            ))}
          </div>
          <div className="flex">
            <div className="relative flex-shrink-0" style={{ width: `${timeColumnWidth}px` }}>
              {Array.from({ length: 16 }, (_, i) => (
                <div
                  key={i}
                  className="absolute text-xs text-neutral-700"
                  style={{ top: `${i * 60 - (i === 0 ? 0 : i === 15 ? 16 : 8)}px` }}
                >
                  {String(9 + i).padStart(2, '0')}:00
                </div>
              ))}
            </div>
            <div
              className="relative"
              style={{
                width: `${computedColumnWidth * Object.keys(Space).length}px`,
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
                ? Array.from({ length: Object.keys(Space).length }).map((_, idx) => {
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
                    .filter((r) => r.date === format(date, 'yyyy-MM-dd'))
                    .map((reservation) => {
                      const start = getMinutes(reservation.startTime);
                      const end = getMinutes(reservation.endTime);

                      const spaceIndex = Object.keys(Space).indexOf(reservation.space);

                      return (
                        <div
                          key={reservation.id}
                          className="absolute flex cursor-pointer flex-col justify-between rounded-md border p-1"
                          style={{
                            top: `${start - 540}px`,
                            height: `${end - start}px`,
                            left: `${spaceIndex * computedColumnWidth + 2}px`,
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
