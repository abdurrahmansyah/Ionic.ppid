import { Component } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { GlobalService, IndexPage } from '../services/global.service';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public router: Router,
    private globalService: GlobalService,
    private alertController: AlertController,
    private authService: AuthenticationService,
    private activatedRoute: ActivatedRoute) {
    this.InitializeData();
  }

  async InitializeData() {
    // await this.globalService.GetUserDataFromStorage();
  }

  async ngOnInit() {
    await this.ShowWelcomeAlertPPID();

    this.activatedRoute.queryParams.subscribe(async () => {
      if (this.router.getCurrentNavigation()) {
        if (this.router.getCurrentNavigation().extras.state) {
          var isUpdateAccountSuccess = this.router.getCurrentNavigation().extras.state.isUpdateAccountSuccess
          
          if (isUpdateAccountSuccess){
            window.location.reload();
            await this.globalService.GetUserDataFromStorage();
          }
        }
      }
    });
  }

  private async ShowWelcomeAlertPPID() {
    if (!this.globalService.isSeenAlertPPID) {
      await this.alertController.create({
        mode: 'ios',
        message: 'This is an alert message.',
        backdropDismiss: true,
        cssClass: 'alert-notification',
      }).then(alert => {
        this.globalService.isSeenAlertPPID = true;
        return alert.present();
      });
    }
  }

  ngOnDestroy() {
    this.globalService.isSeenAlertPPID = false;
  }

  public OpenPermohonanInformasi() {
    this.router.navigate(['permohonan-informasi']);
  }

  public OpenPengajuanKeberatan() {
    this.router.navigate(['pengajuan-keberatan']);
  }

  public ShowInformation(index: number) {
    if (index == 0) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.profilPPID
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 1) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.regulasiPPID
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 2) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.infBerkala
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 3) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.infSertaMerta
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 4) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.infTerSetiapSaat
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 5) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.laporanLayanan
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 6) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.DwnFormulir
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 7) {
      console.log("ini 7");

      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.PermohonanInformasi
        }
      }

      this.router.navigate(['information'], navigationExtras);
    } else if (index == 8) {
      let navigationExtras: NavigationExtras = {
        state: {
          indexForm: this.globalService.IndexPageData.PengajuanKeberatan
        }
      }

      this.router.navigate(['information'], navigationExtras);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/welcome', { replaceUrl: true });
  }
}