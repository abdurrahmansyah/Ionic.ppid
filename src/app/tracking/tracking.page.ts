import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform } from '@ionic/angular';
import { TicketComponent } from '../components/ticket/ticket.component';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {

  idTicket: string;
  email: string;
  loading: any;
  txtIDTicket: string;
  txtStatusTicket: string;
  txtTipeTicket: string;
  txtNamaPemohon: string;
  txtEmail: string;
  txtResponHK: string;
  txtRincianInformasi: string;
  txtTglTiketMasuk: string;
  txtTglTindakLanjut: string;
  txtTglSelesai: string;
  isTicket: boolean = false;

  constructor(private platform: Platform,
    private loadingController: LoadingController, private httpClient: HttpClient,
    private alertController: AlertController) {
    this.InitializeLoadingCtrl();
  }

  ngOnInit() { }

  async InitializeLoadingCtrl() {
    this.loading = await this.loadingController.create({
      mode: 'ios'
    });
  }

  TrackingTicket() {
    try {
      this.ValidateData();
      this.TrackingTicketData();
    } catch (e) {
      this.loadingController.dismiss();
      // this.PresentToast(e.message);
      console.log(e.message);
    }
  }

  private ValidateData() {
    if (!this.idTicket)
      throw new Error('ID Tiket wajib diisi.');
    else if (!this.email)
      throw new Error('Email wajib diisi.');
  }

  private TrackingTicketData() {
    var url = 'https://script.google.com/macros/s/AKfycbxaqQ0_dAgt0KjR2mxgpcbkrKG03N7zPgI5OW6sYljSA_ayL8u8gXIvRzaoEWkH62_mJA/exec?action=read&id=' + this.idTicket + '&email=' + this.email;
    var data: Observable<any> = this.httpClient.get(url);
    this.TrackingTicketDataFromDB(data);
  }

  private TrackingTicketDataFromDB(data: Observable<any>) {
    data.subscribe(data => {
      console.log(data);

      if (data.records) {
        this.isTicket = true;
        this.txtIDTicket = data.records.ID_TIKET;
        this.txtStatusTicket = data.records.STATUS_TIKET;
        this.txtTipeTicket = data.records.TIPE_TIKET;
        this.txtNamaPemohon = data.records.NAMA_PEMOHON;
        this.txtEmail = data.records.EMAIL_PEMOHON;
        this.txtResponHK = data.records.RESPON_HK;
        this.txtRincianInformasi = data.records.RINCIAN_INFORMASI;
        this.txtTglTiketMasuk = data.records.TANGGAL_TIKET_MASUK.split('T')[0];
        this.txtTglTindakLanjut = data.records.TANGGAL_TINDAK_LANJUT.split('T')[0];
        this.txtTglSelesai = data.records.TANGGAL_SELESAI.split('T')[0];
      }
      else this.isTicket = false;
    });
  }

  // private async TrackingTicketData() {
  //   var result: any = "kosongan";
  //   // this.PresentLoading();
  //   fetch('https://script.google.com/macros/s/AKfycbxaqQ0_dAgt0KjR2mxgpcbkrKG03N7zPgI5OW6sYljSA_ayL8u8gXIvRzaoEWkH62_mJA/exec?action=read&id=' + this.idTicket + '&email=' + this.email)
  //     .then(async response => response.json()).then(function (data) {
  //       console.log(data);
  //       console.log(data.records);

  //       if (data.records) {
  //         var ticket = data.records;
  //         this.txtNamaPemohon = ticket.NAMA_PEMOHON;
  //         // console.log(ticket.ASAL_PEMOHON);
  //         // result = "true";

  //       } else {
  //         result = "false";
  //         // throw new Error("Data Email dan ID Tiket tidak dapat ditemukan");
  //       }

  //       // let authors = data.results;
  //       // return authors.map(function (author) {
  //       //   console.log(author);
  //       // })
  //     })
  //   // .catch(function (error) {
  //   //   throw new Error(error);

  //   //   // this.loadingController.dismiss();
  //   //   // this.PresentToast(e.message);
  //   //   // console.log(error);
  //   // })
  //   console.log(result);
  // }

  async PresentLoading() {
    await this.loading.present();
  }

  private async PresentNotif(headerText: string, text: string) {
    await this.alertController.create({
      mode: 'ios',
      header: headerText,
      message: text,
      buttons: [{
        text: 'OK',
      }]
    }).then(alert => {
      return alert.present();
    });
  }
}
