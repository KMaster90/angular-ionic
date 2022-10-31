import { Component, OnInit } from '@angular/core';
import {Place} from '../place.model';
import {PlacesService} from '../places.service';
import {IonItemSliding} from "@ionic/angular";

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offerPlaces: Place[];

  constructor(
    private placesService: PlacesService,
  ) { }

  ngOnInit() {
    this.offerPlaces = this.placesService.places.filter(place => place.offerPrice);
  }

  onEdit(offerId: string, itemSliding: IonItemSliding) {
    itemSliding.close();
    console.log(`Editing item ${offerId}`);
  }

  onDelete(offerId: string, itemSliding: IonItemSliding) {
    itemSliding.close();
    console.log(`Deleting item ${offerId}`);
  }
}
