import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { ApiImage, GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-permohonan-informasi',
  templateUrl: './permohonan-informasi.page.html',
  styleUrls: ['./permohonan-informasi.page.scss'],
})
export class PermohonanInformasiPage implements OnInit {
  credentials: FormGroup;
  images: ApiImage[] = [];
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  isUserDataComplete: boolean = false;
  caraMemperolehInformasiList = [];

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private alertController: AlertController
  ) {
    if (!this.CheckUserData()) {
      this.PresentAlertAccount();
    }
    this.InitializeData();
  }

  private CheckUserData(): boolean {
    if (this.globalService.userData.md_user_status != this.globalService.statusUserData.KYCVERIFIED) {
      return false;
    }
    else return true;
  }

  private PresentAlertAccount() {
    this.alertController.create({
      mode: 'ios',
      message: 'Data diri belum lengkap! Silahkan update data diri terlebih dahulu',
      cssClass: 'alert-akun',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigate(['/tabs/account']);
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  InitializeData() {
    this.caraMemperolehInformasiList.push({ id: 'Dikirim melalui E-Mail' })
    this.caraMemperolehInformasiList.push({ id: 'Mengambil langsung' })
    this.caraMemperolehInformasiList.push({ id: 'Diambil Oleh Kurir' })
    this.caraMemperolehInformasiList.push({ id: 'Dikrim melalui layanan pengiriman online (Go-Send/Grab Express/JNT/JNE/Tiki/dll) *Biaya pengiriman ditanggung oleh pemohon informasi' })
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: [{ value: this.globalService.userData.md_user_name, disabled: true }, [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      tujuan: ['', [Validators.required]],
      rincian: ['', [Validators.required]],
      cara: ['', [Validators.required]],
      lampiran: ['', [Validators.required]],
    });
  }

  get name() {
    return this.credentials.get('name');
  }

  get tujuan() {
    return this.credentials.get('tujuan');
  }

  get rincian() {
    return this.credentials.get('rincian');
  }

  get cara() {
    return this.credentials.get('cara');
  }

  get lampiran() {
    return this.credentials.get('lampiran');
  }

  async PermohonanInformasi() {
    this.globalService.CreatePermohonanInformasi(this.credentials.value);
  }



  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Photos Photo',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });

    const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    const imageName = 'Give me a name';

    this.globalService.uploadImage(blobData, imageName, image.format).subscribe((newImage: ApiImage) => {
      this.images.push(newImage);
    });
  }

  // Used for browser direct file upload
  // uploadFile(event: EventTarget) {
  //   const eventObj: MSInputMethodContext = event as MSInputMethodContext;
  //   const target: HTMLInputElement = eventObj.target as HTMLInputElement;
  //   const file: File = target.files[0];
  //   this.globalService.uploadImageFile(file).subscribe((newImage: ApiImage) => {
  //     this.images.push(newImage);
  //   });
  // }

  deleteImage(image: ApiImage, index) {
    this.globalService.deleteImage(image._id).subscribe(res => {
      this.images.splice(index, 1);
    });
  }

  // Helper function
  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
