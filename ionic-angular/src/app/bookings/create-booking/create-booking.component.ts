import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Place} from '../../places/place.model';
import {ModalController} from '@ionic/angular';
import {Mode} from '../../places/discover/place-detail/place-detail.page';
import {FormGroup, NgForm} from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @ViewChild('f',{static: true}) form: NgForm;
  @Input() selectedPlace: Place;
  @Input() selectedMode: Mode;
  startDate: string;
  endDate: string;

  constructor(private modalController: ModalController
  ) {
  }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if(this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      console.log(this.startDate);
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    } else {
      this.startDate = new Date(availableFrom.getTime()).toISOString();
      this.endDate = new Date(availableTo.getTime()).toISOString();
    }
  }

  onBookPlace() {
    if (!this.form.valid || !this.dateValid()) {
      return;
    }
    console.log(this.form.value);
    this.modalController.dismiss({bookingData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        guestNumber: +this.form.value['guest-number'],
        startDate: new Date(this.form.value['date-from']),
        endDate: new Date(this.form.value['date-to'])
      }}, 'confirm');
  }

  onCancel() {
    this.modalController.dismiss(null, 'cancel');
  }
  dateValid() {
    const startDate = new Date(this.form.value['date-from']);
    const endDate = new Date(this.form.value['date-to']);
    return endDate > startDate;
  }
}
