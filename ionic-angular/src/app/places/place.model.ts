import {PlaceLocation} from './location.model';

export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableFrom: Date,
    public availableTo: Date,
    public userId: string,
    public location: PlaceLocation,
    public offerPrice?: number
  ) {}
}

export type PlaceToPost = Omit<Place, 'id'|'userId'|'offerPrice'|'imageUrl'>;

export type PlaceFromApi = Omit<Place, 'availableFrom'|'availableTo'> & {availableFrom: string; availableTo: string};
