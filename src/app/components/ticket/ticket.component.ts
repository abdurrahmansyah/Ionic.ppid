import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService, TicketData, UserData } from 'src/app/services/global.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {

  // Data passed in by componentProps
  public ticketData: TicketData;
  public userData: UserData;
  public isPermohonan: boolean = false;
  public isKeberatan: boolean = false;
  public statusColor: string;
  public photo: any;

  constructor(private navParams: NavParams,
    private globalService: GlobalService,
    private modalController: ModalController,
    private alertController: AlertController,
    private photoService: PhotoService) {
  }

  ngOnInit() {
    if (this.navParams.get('ticketData')) this.ticketData = this.navParams.get('ticketData');
    if (this.navParams.get('acuanTicketData')) this.ticketData = this.navParams.get('acuanTicketData');
    if (this.navParams.get('userData')) this.userData = this.navParams.get('userData');
    else this.userData = this.globalService.userData;

    this.isPermohonan = this.ticketData.trx_ticket_tipe == this.globalService.ticketTypeData.PERMOHONANINFORMASI ? true : false;
    this.isKeberatan = this.ticketData.trx_ticket_tipe == this.globalService.ticketTypeData.PENGAJUANKEBERATAN ? true : false;
    this.statusColor = this.ticketData.trx_ticket_status == this.globalService.statusTransaksiData.OPEN ? "orangered" :
      this.ticketData.trx_ticket_status == this.globalService.statusTransaksiData.INPROGRESS ? "darkblue" :
        this.ticketData.trx_ticket_status == this.globalService.statusTransaksiData.CLOSE ? "green" : "black";
  }

  ionViewDidEnter() {
    this.photo = this.photoService.ConvertPhotoBase64ToImage(this.ticketData.trx_ticket_lampiran);
  }
  public CloseDetailTicket() {
    this.modalController.dismiss(
      { dataPassing: "JUSTCANCEL" },
      'backdrop'
    );
  }

  public CancelTicket() {
    this.alertController.create({
      mode: 'ios',
      message: 'Apakah Anda Yakin Ingin Membatalkan Tiket Tersebut ?',
      cssClass: 'alert-akun',
      buttons: [{
        text: 'YES',
        handler: () => {
          var data = this.globalService.CancelTicket(this.ticketData);
          this.SubscribeCancelTicket(data);
        }
      }, {
        text: 'CANCEL',
        role: 'Cancel'
      }]
    }).then(alert => {
      return alert.present();
    });
  }

  private SubscribeCancelTicket(data: Observable<any>) {
    data.subscribe(
      (data: any) => {
        console.log(data);
        if (data.isSuccess) {
          this.globalService.PresentToast("Berhasil Membatalkan Tiket");
          this.modalController.dismiss(
            { dataPassing: "CANCELTICKET" },
            'confirm'
          );
        }
        else {
          this.globalService.PresentToast(data.error_msg);
        }
      }
    );
  }
}
