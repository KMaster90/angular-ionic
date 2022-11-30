import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController
} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {CreateBookingComponent} from '../../../bookings/create-booking/create-booking.component';
import {Subscription} from 'rxjs';
import {BookingService} from '../../../bookings/booking.service';
import {BookingModel} from '../../../bookings/booking.model';
import {AuthService} from '../../../auth/auth.service';
import {MapModalComponent} from '../../../shared/map-modal/map-modal.component';

export type Mode = 'select' | 'random';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private placesService: PlacesService,
    private bookingService: BookingService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/discover');
        return;
      }
      this.isLoading = true;
      this.sub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          this.isLoading = false;
        },
        error => {
          this.alertController.create({
            header: 'An error occurred!',
            message: 'Could not load place.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/places/discover']);
                }
              }
            ]
          }).then(alertEl => alertEl.present());
        }
      );
    });
  }

  onBookPlace() {
    this.actionSheetController.create({
      header: 'Choose an action',
      buttons: [
        {
          text: 'Select Date', handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date', handler: () => {
            this.openBookingModal('random');
          }
        },
        {text: 'Cancel', role: 'cancel'},
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  openBookingModal(mode: Mode) {
    console.log(mode);
    this.modalController.create({
      component: CreateBookingComponent,
      componentProps: {selectedPlace: this.place, selectedMode: mode}
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
      console.log(resultData.data, resultData.role);
      if (resultData.role === 'confirm') {
        this.loadingController.create({
          message: 'Booking place...'
        }).then(loadingEl => {
          loadingEl.present();
          const bookingData: Omit<BookingModel, 'id' | 'userId'> = {
            placeId: this.place.id,
            placeTitle: this.place.title,
            placeImage: this.place.imageUrl,
            firstName: resultData.data.bookingData.firstName,
            lastName: resultData.data.bookingData.lastName,
            guestNumber: resultData.data.bookingData.guestNumber,
            bookedFrom: resultData.data.bookingData.dateFrom,
            bookedTo: resultData.data.bookingData.dateTo,
          };
          this.bookingService.addBooking(bookingData).subscribe(() => loadingEl.dismiss());
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onShowFullMap() {
    this.modalController.create({
      component: MapModalComponent,
      componentProps: {
        center: {lat: this.place.location.lat, lng: this.place.location.lng},
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address
      }
    });
  }
}
