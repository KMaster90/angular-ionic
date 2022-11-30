import {Injectable} from '@angular/core';
import {BookingModel} from './booking.model';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {delay, map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PlaceFromApi} from '../places/place.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings= new BehaviorSubject<BookingModel[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
              ) {
  }
  get bookings() {
    // eslint-disable-next-line no-underscore-dangle
    return this._bookings.asObservable();
  }

  addBooking(booking: Omit<BookingModel,'id'|'userId'>) {
    let generatedId: string;
    const newBooking = new BookingModel(
      Math.random().toString(),
      booking.placeId,
      this.authService.userId,
      booking.placeTitle,
      booking.placeImage,
      booking.firstName,
      booking.lastName,
      booking.guestNumber,
      booking.bookedFrom,
      booking.bookedTo
    );
    return this.http.post<PlaceFromApi>('https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', {...newBooking, id: null})
      .pipe(
        switchMap(resData => {
          generatedId = resData.title;
          return this.bookings;
        }),
        take(1),
        // eslint-disable-next-line no-underscore-dangle
        tap(bookings => this._bookings.next(bookings.concat({...newBooking, id: generatedId})))
      );
  }

  cancelBooking(bookingId: string) {
    return this.http.delete(`https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/bookings/${bookingId}.json`)
      .pipe(
        switchMap(() => this.bookings),
        take(1),
        // eslint-disable-next-line no-underscore-dangle
        tap(bookings => this._bookings.next(bookings.filter(b => b.id !== bookingId)))
      );
  }
  fetchBookings() {
    return this.http.get<BookingModel>(`https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
      .pipe(
        map(resData => Object.entries(resData).map(([key, value]) => new BookingModel(
          key,
          value.placeId,
          value.userId,
          value.placeTitle,
          value.placeImage,
          value.firstName,
          value.lastName,
          value.guestNumber,
          new Date(value.bookedFrom),
          new Date(value.bookedTo)
        ))),
        // eslint-disable-next-line no-underscore-dangle
        tap(bookings => this._bookings.next(bookings))
      );
  }
}
