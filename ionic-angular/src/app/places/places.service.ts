import {Injectable} from '@angular/core';
import {Place, PlaceFromApi, PlaceToPost} from './place.model';
import {AuthService} from '../auth/auth.service';
import {BehaviorSubject, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get places() {
    const {_places} = this;
    return _places.asObservable();
  }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceFromApi }>('https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json')
      .pipe(
        map(resData => Object.entries(resData).map(([key, value]) => new Place(
            key,
            value.title,
            value.description,
            value.imageUrl,
            value.price,
            new Date(value.availableFrom),
            new Date(value.availableTo),
            value.userId,
            value.location,
            value.offerPrice,
          ))
        ),
        // eslint-disable-next-line no-underscore-dangle
        tap(places => this._places.next(places))
      );
  }

  getPlace(placeId: string) {
    return this.http.get<PlaceFromApi>(`https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`)
      .pipe(
        map(place => new Place(place.id, place.title, place.description, place.imageUrl, place.price, new Date(place.availableFrom), new Date(place.availableTo), place.userId, place.location, place.offerPrice))
      );
  }

  uploadImage(image: File | Blob) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.http.post<{ imageUrl: string; imagePath: string }>('https://us-central1-ionic-angular-6ec56.cloudfunctions.net/storeImage', uploadData);
  }

  addPlace(place: PlaceToPost, imageUrl: string) {
    const {title, description, price, availableFrom, availableTo, location} = place;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      imageUrl,
      price,
      availableFrom,
      availableTo,
      this.authService.userId,
      location,
    );
    return this.http.post<PlaceFromApi>('https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/offered-places.json', {
      ...newPlace,
      id: null
    }).pipe(
      switchMap(resData => {
        newPlace.id = resData.title;
        return this.places;
      }),
      take(1),
      // delay(1000),
      tap(places => {
        // eslint-disable-next-line no-underscore-dangle
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updateOffer(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[] = [];
    return this.places.pipe(
      take(1),
      switchMap(places => (!places || places.length <= 0) ? this.fetchPlaces() : of(places)),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId,
          oldPlace.location,
          oldPlace.offerPrice,
        );
        return this.http.put(`https://ionic-angular-6ec56-default-rtdb.europe-west1.firebasedatabase.app/offered-places/${placeId}.json`, {
          ...updatedPlaces[updatedPlaceIndex], id: null
        });
      }),
      tap(places => {

        // eslint-disable-next-line no-underscore-dangle
        this._places.next(updatedPlaces);
      })
    );
  }
}
