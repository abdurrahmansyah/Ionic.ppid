import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  IndexPageData: IndexPage;

  constructor() {
    this.IndexPageData = new IndexPage();
  }
}

export class IndexPage {
  public readonly profilPPID: string = "profilPPID";
  public readonly regulasiPPID: string = "regulasiPPID";
  public readonly infBerkala: string = "infBerkala";
  public readonly infSertaMerta: string = "infSertaMerta";
  public readonly infTerSetiapSaat: string = "infTerSetiapSaat";
  public readonly laporanLayanan: string = "laporanLayanan";
  public readonly DwnFormulir: string = "DwnFormulir";
  public readonly PermohonanInformasi: string = "PermohonanInformasi";
  public readonly PengajuanKeberatan: string = "PengajuanKeberatan";
}