import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GlobalService, IndexPage } from '../services/global.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public router: Router,
    private globalService: GlobalService,
    private alertController: AlertController) {
  }

  async ngOnInit() {
    await this.alertController.create({
      mode: 'ios',
      message: 'This is an alert message.',
      backdropDismiss: true,
      cssClass: 'alert-notification',
      // buttons: [{
      //   text: 'WFO - Proyek',
      //   handler: () => {
      //     this.ByPassDoingAbsenWfoNewNormal(reportData, true);
      //   }        // role: 'Cancel'
      // }, {
      //   text: 'WFH',
      //   handler: () => {
      //     this.globalService.dateRequest = reportData.dateAbsen;
      //     this.globalService.timeRequest = reportData.timeAbsen;
      //     this.globalService.diluarKantor = reportData.szActivityId;
      //     this.router.navigate(['form-request'], navigationExtras);
      //   }
      // }]
    }).then(alert => {
      return alert.present();
    });
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
}