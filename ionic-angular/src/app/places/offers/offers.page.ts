import {Component, OnDestroy, OnInit} from '@angular/core';
import {Place} from '../place.model';
import {PlacesService} from '../places.service';
import {IonItemSliding, ViewWillEnter} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit,OnDestroy,ViewWillEnter {
  offerPlaces: Place[];
  isLoading = false;
  private sub: Subscription;

  constructor(
    private placesService: PlacesService,
  ) { }

  ngOnInit() {
    this.sub = this.placesService.places
      // .pipe(map(places=>places.filter(place => place.offerPrice)))
      .subscribe(places => this.offerPlaces = places);
  }
  ionViewWillEnter(){
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(()=>this.isLoading = false);
  }

  onEdit(offerId: string, itemSliding: IonItemSliding) {
    itemSliding.close();
    console.log(`Editing item ${offerId}`);
  }

  onDelete(offerId: string, itemSliding: IonItemSliding) {
    itemSliding.close();
    console.log(`Deleting item ${offerId}`);
  }
  ngOnDestroy(){
    this.sub?.unsubscribe();
  }
}
