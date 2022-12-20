import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlacesService} from '../places.service';
import {Place} from '../place.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  isLoading = false;
  private filter = 'all';
  private sub: Subscription;

  constructor(
    private placesService: PlacesService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.sub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.onFilterUpdate(this.filter);
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = places.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => this.isLoading = false);
  }

  onFilterUpdate(filter: string) {
    this.authService.userId.pipe(take(1)).subscribe(
      userId => {
        const isShown = place => filter === 'all' || place.userId !== this.authService.userId;
        this.relevantPlaces = this.loadedPlaces.filter(isShown);
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
        this.filter = filter;
      });
  }

  /* onFilterUpdate(filter: string) {
     this.authService.userId.pipe(take(1)).subscribe(userId => {
       const isShown = place => filter === 'all' || place.userId !== userId;
       this.relevantPlaces = this.loadedPlaces.filter(isShown);
       this.filter = filter;
     });
   }*/

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
