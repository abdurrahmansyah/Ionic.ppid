import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { AuthFirebaseService } from 'src/app/services/auth-firebase.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {

  user: any;

  constructor(private modalController: ModalController,
    private authFirebaseService: AuthFirebaseService,
    private navParams: NavParams,
    private loadingController: LoadingController,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.user = this.navParams.get('user');
  }

  public CloseModalEmailVerification() {
    this.modalController.dismiss(
      { dataPassing: "BACKTOLOGIN" },
      'backdrop'
    );
  }

  public async ResendVerif() {
    try {
      const loading = await this.loadingController.create();
      await loading.present();

      this.authFirebaseService.sendEmailVerification(this.user).then(async () => {
        await loading.dismiss();
        this.globalService.PresentToast("Berhasil Mengirimkan Kode Verifikasi");
      }).catch(async (error) => {
        await loading.dismiss();
        var error_msg = error.split('(')[1];
        error_msg = error_msg.split(')')[0];

        if (error_msg == "auth/too-many-requests") {
          this.globalService.PresentAlert("Gagal mengirimkan kode verifikasi! Silahkan coba lagi nanti");
        }
      });
    } catch (e) {
      console.log(e);
      this.globalService.PresentAlert(e);
    }
  }
}
