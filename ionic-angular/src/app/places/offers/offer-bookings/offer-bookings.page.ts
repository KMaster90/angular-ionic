import {Component, OnInit} from '@angular/core';
import {Place} from "../../place.model";
import {ActivatedRoute} from '@angular/router';
import {PlacesService} from '../../places.service';
import {NavController} from "@ionic/angular";

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  place: Place;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        // redirect
        this.navCtrl.navigateBack('/places/offers');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('offerId'));
    });
  }

}
