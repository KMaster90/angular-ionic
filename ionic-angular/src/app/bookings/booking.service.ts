import {Injectable} from '@angular/core';
import {BookingModel} from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: BookingModel[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      userId: 'abc',
      placeTitle: 'Manhattan Mansion',
      guestNumber: 2
    },
    {
      id: 'abc',
      placeId: 'p2',
      userId: 'xyz',
      placeTitle: 'L\'Amour Toujours',
      guestNumber: 1
    },
  ];

  constructor() {
  }
  get bookings() {
    const {_bookings} = this;
    return [..._bookings];
  }

}
