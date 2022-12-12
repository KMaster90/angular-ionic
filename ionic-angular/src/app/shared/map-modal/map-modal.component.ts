import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center = {lat: -34.397, lng: 150.644};
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  googleMaps: typeof google.maps;
  clickListener: any;

  constructor(private modalController: ModalController, private renderer: Renderer2) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.modalController.dismiss();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getGoogleMaps().then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });
        googleMaps.event.addListenerOnce(map, 'idle', () => this.renderer.addClass(mapEl, 'visible'));
        if (this.selectable) {
          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {lat: event.latLng.lat(), lng: event.latLng.lng()};
            this.modalController.dismiss(selectedCoords);
          });
        }
        else {
          const marker = new googleMaps.Marker({position: this.center, map, title: 'Picked Location'});
          marker.setMap(map);
        }
      }).catch(err => console.log(err));
    },);
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  private getGoogleMaps(): Promise<typeof google.maps> {
    if (window.google?.maps) {
      return Promise.resolve(window.google.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsAPIKey}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        if (window.google?.maps) {
          resolve(window.google.maps);
        } else {
          reject('Google maps SDK not available');
        }
      };
    });
  }
}
