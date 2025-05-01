'use client';

import { useEffect, useState } from 'react';

import ReservationCard from '@/app/my-reservations/_component/reservation-card';

import { Skeleton } from '@/component/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/component/ui/tabs';

import { driver, myMockReservations } from '@/constant/guide';
import { myReservationsDriver } from '@/constant/guide/my-reservations';

import Api from '@/api';
import { ReservationDto, ReservationStatus } from '@/api/types/reservation';

import { useGuideStore } from '@/store/guide.store';

import { useApi } from '@/hook/use-api';

import { useQueryState } from 'nuqs';

export default function Page() {
  const [isApiProcessing, startApi] = useApi();

  const { showGuide } = useGuideStore();

  const [tab, setTab] = useQueryState('tab', {
    defaultValue: 'active',
    history: 'push',
    clearOnDefault: false,
  });
  const [reservations, setReservations] = useState<ReservationDto[]>([]);

  useEffect(() => {
    if (showGuide) return;
    startApi(async () => {
      const { reservations } = await Api.Domain.Reservation.getMyReservations();
      setReservations(reservations);
    });
  }, [showGuide]);

  useEffect(() => {
    if (!showGuide) return;
    driver.setConfig(myReservationsDriver);
    driver.drive();
    setReservations(myMockReservations);
  }, [showGuide]);

  return (
    <div className="flex flex-col gap-8">
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value);

          if (showGuide && value === 'previous') {
            setTimeout(driver.moveNext, 200);
          }
        }}
      >
        <TabsList>
          <TabsTrigger id="my-reservation-tab-active" value="active">
            진행중인 예약
          </TabsTrigger>
          <TabsTrigger id="my-reservation-tab-previous" value="previous">
            지난 예약
          </TabsTrigger>
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
