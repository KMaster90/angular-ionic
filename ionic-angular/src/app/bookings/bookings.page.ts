import {Component, OnInit} from '@angular/core';
import {BookingService} from './booking.service';
import {BookingModel} from './booking.model';
import {IonItemSliding} from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: BookingModel[];

  constructor(private bookingService: BookingService,) {
  }

  ngOnInit() {
    this.loadedBookings= this.bookingService.bookings;
  }

  onDeleteBooking(bookingId: string, itemSliding: IonItemSliding) {
    console.log('DELETE BOOKING', bookingId, itemSliding);
    itemSliding.close();
  }
}
