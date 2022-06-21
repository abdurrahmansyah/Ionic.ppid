import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  public async TakeAPhoto(): Promise<Photo> {
    // Take a photo
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 60,
      saveToGallery: true
    });

    return image;
  }

  public async ChooseFromGallery(): Promise<Photo> {
    // Choose From Gallery
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
      quality: 60
    });

    return image;
  }

  public ConvertPhotoBase64ToImage(imageBase64String){
    return 'data:image/jpeg;base64,' + imageBase64String;
  }
}
