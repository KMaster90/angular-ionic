import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LocationPickerComponent} from './pickers/location-picker/location-picker.component';
import {MapModalComponent} from './map-modal/map-modal.component';
import {IonicModule} from '@ionic/angular';
import {ImagePickerComponent} from './pickers/image-picker/image-picker.component';

const components = [LocationPickerComponent,ImagePickerComponent,MapModalComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, IonicModule],
  exports: components
})
export class SharedModule { }
