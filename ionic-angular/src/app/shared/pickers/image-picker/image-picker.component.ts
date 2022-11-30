import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {Camera, CameraResultType, CameraSource} from '@capacitor/camera';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick= new EventEmitter<string>();
  selectedImage: string;

  constructor() { }

  ngOnInit() {}

  openPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    Camera.getPhoto({
      quality: 100,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 600,
      resultType: CameraResultType.DataUrl,
    })
      .then(image => this.imagePick.emit(this.selectedImage = image.dataUrl))
      .catch(error => {
        console.log(error);
        return false;
      }
    );
  }
}
