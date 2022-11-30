import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AlertController, LoadingController, NavController} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Place} from '../../place.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit,OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading = false;

  private sub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('offerId')) {
        this.navCtrl.navigateBack('/places/offers');
        return;
      }
      this.isLoading = true;
      this.sub = this.placesService.getPlace(paramMap.get('offerId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required],
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)],
          }),
        });
        this.isLoading = false;
      },
        error => {
          this.alertController.create({
            header: 'An error occurred!',
            message: 'Place could not be fetched. Please try again later.',
            buttons: [{
              text: 'Okay',
              handler: () => {
                this.navCtrl.navigateBack('/places/offers');
              }
            }]
          }).then(alertEl => alertEl.present());
        }
        );
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updateOffer(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.navCtrl.navigateBack('/places/offers');
      });
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
