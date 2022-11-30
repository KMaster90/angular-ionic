import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';
import {MapModalComponent} from '../../map-modal/map-modal.component';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map, switchMap} from 'rxjs/operators';
import {Coordinates, PlaceLocation} from '../../../places/location.model';
import {Capacitor} from '@capacitor/core';
import {Geolocation} from '@capacitor/geolocation';
import {of} from 'rxjs';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  selectedLocationImage: string;
  isLoading = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private http: HttpClient,
    private actionSheetController: ActionSheetController,
  ) { }

  ngOnInit() {}

  openPickLocation() {
    this.actionSheetController.create({
      header: 'Please Choose',
      buttons: [
        {text: 'Auto-Locate', handler: () => this.locateUser()},
        {text: 'Pick on Map', handler: () => this.openMap()},
        {text: 'Cancel', role: 'cancel'},
      ]
    }).then(actionSheetEl => actionSheetEl.present());
  }

  private getAddresses(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`)
      .pipe(map(geoData => (!geoData || !geoData.results || geoData.results.length === 0) ? null : geoData.results[0].formatted_address)
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap&markers=color:red%7Clabel:Place%7C${lat},${lng}&key=${environment.googleMapsAPIKey}`;
  }

  private openMap() {
    this.modalController.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (modalData.data) {
          const {lat, lng} = modalData.data;
          this.createPlace(lat, lng);
        }
      });
      modalEl.present();
    });
  }

  private locateUser() {
    console.log('locate user');
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    this.isLoading = true;
    Geolocation.getCurrentPosition().then(
      geoPosition => {
        const coordinates: Coordinates = {lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude};
        this.createPlace(coordinates.lat, coordinates.lng);
      }
    ).catch(error => {
      this.isLoading = false;
      this.showErrorAlert();
    });
  }

  private showErrorAlert() {
    this.alertController.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location!',
      buttons: ['Okay']
    }).then(alertEl => alertEl.present());
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation = {lat, lng, address: null, staticMapImageUrl: null};
    this.isLoading = true;
    this.getAddresses(lat, lng)
      .pipe(switchMap(address => {
        pickedLocation.address = address;
        return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14));
      }))
      .subscribe(staticMapImageUrl => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        console.log(pickedLocation);
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }
}
