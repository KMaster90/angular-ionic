import {Component, OnDestroy, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {BookingModel} from './booking.model';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit,OnDestroy {
  loadedBookings: BookingModel[];
  private bookingSub: Subscription;

  constructor(private bookingService: BookingService, private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }
  ionViewWillEnter() {
    this.loadingController.create({
      message: 'Loading bookings...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.fetchBookings().subscribe(() => {
        loadingEl.dismiss();
      },
        error => loadingEl.dismiss());
    });
  }

  onDeleteBooking(bookingId: string, itemSliding: IonItemSliding) {
    console.log('DELETE BOOKING', bookingId, itemSliding);
    itemSliding.close();
    this.loadingController.create({
      message: 'Deleting booking...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }
  ngOnDestroy() {
      this.bookingSub?.unsubscribe();
  }
}
