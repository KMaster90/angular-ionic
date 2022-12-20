import {Injectable} from '@angular/core';
import {BookingModel} from './booking.model';
import {BehaviorSubject, forkJoin, of} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {PlaceFromApi} from '../places/place.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings = new BehaviorSubject<BookingModel[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {
  }

  get bookings() {
    // eslint-disable-next-line no-underscore-dangle
    return this._bookings.asObservable();
  }

  addBooking(booking: Omit<BookingModel, 'id' | 'userId'>) {
    let generatedId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
          if (!userId) {
            throw new Error('No user id found!');
          }
          return of(new BookingModel(
            Math.random().toString(),
            booking.placeId,
            userId,
            booking.placeTitle,
            booking.placeImage,
            booking.firstName,
            booking.lastName,
            booking.guestNumber,
            booking.bookedFrom,
            booking.bookedTo
          ));
        }
      ),
      switchMap(newBooking =>
        forkJoin({
          resData: this.http.post<PlaceFromApi>('https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', {
            ...newBooking,
            id: null
          }),
          newBooking: of(newBooking)
        })
      ),
      switchMap(({newBooking, resData}) => {
        generatedId = resData.title;
        return forkJoin({
          bookings: this.bookings.pipe(take(1)),
          newBooking: of(newBooking)
        });
      }),
      take(1),
      // eslint-disable-next-line no-underscore-dangle
      tap(({newBooking, bookings}) => this._bookings.next(bookings.concat({...newBooking, id: generatedId})))
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
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => this.http.get<BookingModel>(`https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?orderBy="userId"&equalTo="${userId}"`)),
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
