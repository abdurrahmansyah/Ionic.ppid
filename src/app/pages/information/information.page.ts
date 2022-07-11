import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {

  isProfilPPID: boolean = false;
  isRegulasiPPID: boolean = false;
  isInformasiBerkala: boolean = false;
  isInformasiSertaMerta: boolean = false;
  isInformasiTersediaSetiapSaat: boolean = false;
  isLaporanLayananInformasiPublik: boolean = false;
  isDownloadFormulir: boolean = false;
  isPengajuanInf: boolean = false;
  isKeberatan: boolean = false;
  isDisabilitas: boolean = false;

  constructor(public activatedRoute: ActivatedRoute,
    public router: Router,
    private globalService: GlobalService) { }

  ngOnInit() {
    this.SetFormByIndex();
  }

  private SetFormByIndex() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.isProfilPPID = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.profilPPID ? true : false;
        this.isRegulasiPPID = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.regulasiPPID ? true : false;
        this.isInformasiBerkala = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.infBerkala ? true : false;
        this.isInformasiSertaMerta = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.infSertaMerta ? true : false;
        this.isInformasiTersediaSetiapSaat = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.infTerSetiapSaat ? true : false;
        this.isLaporanLayananInformasiPublik = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.laporanLayanan ? true : false;
        this.isDownloadFormulir = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.DwnFormulir ? true : false;
        this.isPengajuanInf = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.PermohonanInformasi ? true : false;
        this.isKeberatan = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.PengajuanKeberatan ? true : false;
        this.isDisabilitas = this.router.getCurrentNavigation().extras.state.indexForm == this.globalService.IndexPageData.Disabilitas ? true : false;
      }
    });
  }
}
