'use client';

import { useEffect, useState } from 'react';

import ReservationCard from '@/app/my-reservations/_component/reservation-card';

import { Skeleton } from '@/component/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/component/ui/tabs';

import Api from '@/api';
import { ReservationDto, ReservationStatus } from '@/api/types/reservation';

import { useApi } from '@/hook/use-api';

type TabValue = 'active' | 'previous';

export default function Page() {
  const [isApiProcessing, startApi] = useApi();

  const [tab, setTab] = useState<TabValue>('active');
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  useEffect(() => {
    startApi(async () => {
      const { reservations } = await Api.Domain.Reservation.getMyReservations();
      setReservations(reservations);
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
        <TabsList>
          <TabsTrigger value="active">진행중인 예약</TabsTrigger>
          <TabsTrigger value="previous">지난 예약</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-4">
        {isApiProcessing
          ? Array.from({ length: 4 }).map((_, idx) => (
              <Skeleton key={idx} className="h-[114px] rounded-md" />
            ))
          : reservations
              .filter((reservation) => {
                if (tab === 'previous') return reservation.status === ReservationStatus.RETURNED;
                return (
                  reservation.status === ReservationStatus.PENDING ||
                  reservation.status === ReservationStatus.IN_USE
                );
              })
              .map((reservation) => (
                <ReservationCard
                  key={reservation.id}
                  reservation={reservation}
                  setReservation={setReservations}
                />
              ))}
      </div>
    </div>
  );
}
