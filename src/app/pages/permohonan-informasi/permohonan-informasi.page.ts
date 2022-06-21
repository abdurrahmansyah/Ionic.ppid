import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { ApiImage, GlobalService } from 'src/app/services/global.service';
import { PhotoService } from 'src/app/services/photo.service';

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
  public photo: any;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
    private alertController: AlertController,
    private photoService: PhotoService,
    private datePipe: DatePipe
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
      lampiran: [{ value: '', disabled: true }, [Validators.required]],
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
    this.credentials.controls['lampiran'].enable();
    this.globalService.CreatePermohonanInformasi(this.credentials.value);
    this.credentials.controls['lampiran'].disable();
  }

  public async TakeAPhoto() {
    this.alertController.create({
      mode: 'ios',
      message: 'Usahakan Foto dengan Posisi Kamera Landscape!',
      cssClass: 'alert-akun',
      buttons: [{
        text: 'Batal',
        role: 'Cancel'
      }, {
        text: 'Lanjut',
        handler: async () => {
          const image = await this.photoService.TakeAPhoto();
          this.photo = this.photoService.ConvertPhotoBase64ToImage(image.base64String);

          // var dateData = this.globalService.GetDate()
          // var name = this.datePipe.transform(dateData.date, 'yyyy-MM-dd') + " " + this.globalService.userData.md_user_name + "." + this.image.format;
          this.credentials.controls['lampiran'].setValue(image.base64String);
        }
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  /////////////////////////////// GAK KEPAKAI ///////////////////////////////

  //#region Code FAB BUTTON HIT ACTION SHEET

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
  }

  //#endregion

  /////////////////////////////// GAK KEPAKAI ///////////////////////////////
}
