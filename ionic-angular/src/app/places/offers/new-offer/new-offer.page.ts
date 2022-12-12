import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PlacesService} from '../../places.service';
import {PlaceToPost} from '../../place.model';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {PlaceLocation} from '../../location.model';
import {base64toBlob} from './base64ToBlob';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup<{ [prop in keyof Omit<PlaceToPost, 'availableFrom' | 'availableTo'>]: FormControl<PlaceToPost[prop]> }
    & { [prop in keyof Pick<PlaceToPost, 'availableFrom' | 'availableTo'>]: FormControl<string> }>;

  constructor(private placesService: PlacesService, private router: Router, private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', {updateOn: 'blur', validators: [Validators.required]}),
      description: new FormControl('', {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(0, {updateOn: 'blur', validators: [Validators.required, Validators.min(1)]}),
      availableFrom: new FormControl(new Date().toISOString(), {updateOn: 'blur', validators: [Validators.required]}),
      availableTo: new FormControl(new Date().toISOString(), {updateOn: 'blur', validators: [Validators.required]}),
      location: new FormControl(null, {validators: [Validators.required]}),
    });
    this.form.addControl('image', new FormControl(null, {validators: [Validators.required]}));
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    console.log('Creating offer place', this.form);
    const {title, description, price, availableFrom, availableTo, location} = this.form.value;
    this.loadingController.create({
      message: 'Creating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.uploadImage(this.form.controls.image.value)
        .pipe(
          switchMap(uploadRes =>
            this.placesService
              .addPlace({
                title,
                description,
                price,
                availableFrom: new Date(availableFrom),
                availableTo: new Date(availableTo),
                location
              }, uploadRes.imageUrl)
          )
        )
        .subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/places/offers']);
        });
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({location});
  }

  onImagePicked(image: File | string) {
    let imageFile: File | Blob;
    if (typeof image === 'string') {
      try {
        imageFile = base64toBlob(image.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch (err) {
        console.log(err);
        return;
      }
    } else {
      imageFile = image;
    }
    this.form.patchValue({image: imageFile});
  }
}
