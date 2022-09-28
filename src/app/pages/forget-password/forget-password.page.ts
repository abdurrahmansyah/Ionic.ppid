import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonNav, LoadingController, ModalController } from '@ionic/angular';
import { AuthFirebaseService } from 'src/app/services/auth-firebase.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  level = 0;
  nextPage = ForgetPasswordPage;
  credentials: FormGroup;

  constructor(private modalController: ModalController,
    private nav: IonNav,
    private fb: FormBuilder,
    private authFirebaseService: AuthFirebaseService,
    private loadingController: LoadingController,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.credentials.get('email');
  }

  goForward() {
    this.nav.push(this.nextPage, { level: this.level + 1 });
  }

  public GoRoot() {
    this.nav.popToRoot();
  }

  public CloseForgotPasword() {
    this.modalController.dismiss();
  }

  public async ForgetPassword() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();

      this.credentials.value.email = this.credentials.value.email.toLowerCase();
      this.authFirebaseService.sendPasswordResetEmail(this.credentials.value.email).then(async (aaaa) => {
        console.log(aaaa);
        
        await loading.dismiss();
        this.globalService.PresentToast("Berhasil Mengirimkan Kode Verifikasi");
        this.nav.push(this.nextPage, { level: this.level + 1 });
      }).catch(async (error) => {
        await loading.dismiss();
        this.globalService.PresentAlert(error);
      });
    } catch (e) {
      console.log(e);
      this.globalService.PresentAlert(e);
    }
  }

  public Login() {
    this.modalController.dismiss();
  }

  public ResendLinkForgetPassword() {

  }
}
