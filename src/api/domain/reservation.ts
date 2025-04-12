import ApiRequest from '@/api/request';
import {
  ReservationRequest,
  ReservationResponse,
  ReservationsResponse,
} from '@/api/types/reservation';

import { toLocalDate } from '@/lib/utils';

export default class Reservation {
  constructor(private readonly request: ApiRequest) {}

  public async getMyReservations(): Promise<ReservationsResponse> {
    return this.request.get('/reservations/me');
  }

  public async getDailyReservations(date: Date): Promise<ReservationsResponse> {
    return this.request.get('/reservations/daily?date=' + toLocalDate(date));
  }

  public async getWeeklyReservations(
    startDate: Date,
    endDate: Date,
  ): Promise<ReservationsResponse> {
    return this.request.get(
      '/reservations/weekly?startDate=' +
        toLocalDate(startDate) +
        '&endDate=' +
        toLocalDate(endDate),
    );
  }

  public async reserve(body: ReservationRequest): Promise<ReservationResponse> {
    return this.request.post('/reservations', body);
  }

  public async cancelReservation(reservationId: string): Promise<void> {
    return this.request.delete(`/reservations/${reservationId}`);
  }

  public async returnReservation(reservationId: string, file: File): Promise<ReservationResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request.post(`/reservations/${reservationId}/return`, formData);
  }
}
