import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService, TicketData } from 'src/app/services/global.service';
import { PhotoService } from 'src/app/services/photo.service';
import { UserApprovalComponent } from '../user-approval/user-approval.component';

@Component({
  selector: 'app-ticket-approval',
  templateUrl: './ticket-approval.component.html',
  styleUrls: ['./ticket-approval.component.scss'],
})
export class TicketApprovalComponent implements OnInit {

  public approvalTicketData: TicketData;
  public photo: any;
  public isStatusOpen: boolean = false;
  public isStatusInProgress: boolean = false;
  public isStatusClose: boolean = false;
  public statusColor: string;

  constructor(private navParams: NavParams,
    private globalService: GlobalService,
    private modalController: ModalController,
    private alertController: AlertController,
    private photoService: PhotoService) { }

  ngOnInit() {
    this.approvalTicketData = this.navParams.get('approvalTicketData');
    this.photo = this.photoService.ConvertPhotoBase64ToImage(this.approvalTicketData.trx_ticket_lampiran);
    // this.userData = this.globalService.userData;
    // this.isPermohonan = this.approvalUserData.trx_ticket_tipe == this.globalService.ticketTypeData.PERMOHONANINFORMASI ? true : false;
    // this.isKeberatan = this.approvalUserData.trx_ticket_tipe == this.globalService.ticketTypeData.PENGAJUANKEBERATAN ? true : false;
    this.isStatusOpen = this.approvalTicketData.trx_ticket_status == this.globalService.CapitalizeEachWord(this.globalService.statusTransaksiData.OPEN) ? true : false;
    this.isStatusInProgress = this.approvalTicketData.trx_ticket_status == this.globalService.CapitalizeEachWord(this.globalService.statusTransaksiData.INPROGRESS) ? true : false;
    this.isStatusClose = this.approvalTicketData.trx_ticket_status == this.globalService.CapitalizeEachWord(this.globalService.statusTransaksiData.CLOSE) ? true : false;
    this.statusColor = this.approvalTicketData.trx_ticket_status == this.globalService.CapitalizeEachWord(this.globalService.statusTransaksiData.OPEN) ? "orangered" :
      this.approvalTicketData.trx_ticket_status == this.globalService.CapitalizeEachWord(this.globalService.statusTransaksiData.INPROGRESS) ? "yellow" :
        this.approvalTicketData.trx_ticket_status == this.globalService.CapitalizeEachWord(this.globalService.statusTransaksiData.CLOSE) ? "green" : "black";
  }

  public CloseTicketApproval() {
    this.modalController.dismiss(
      { dataPassing: "JUSTCANCEL" },
      'backdrop'
    );
  }

  public async DetailIdentitasUser() {
    const modal = await this.modalController.create({
      component: UserApprovalComponent,
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6],
      mode: 'ios',
      componentProps: {
        'userData': this.approvalTicketData.trx_ticket_user_data
      }
    });

    // modal.present();
    modal.onDidDismiss().then((modelData) => {
      if (modelData.role == "backdrop") {
        console.log("Log : Close Detail Identitas User");
        // if (modelData.data.dataPassing == "JUSTCANCEL") {
        //   console.log("Log : Close Detail Identitas User");
        // }
      }
    })

    console.log("Log : Open Detail Identitas User");
    return await modal.present();
  }

  public StartProcessTicket(approvalTicketData) {
    try {
      this.alertController.create({
        mode: 'ios',
        message: 'Apakah Anda Yakin Ingin Memulai Proses Tiket Tersebut ?',
        cssClass: 'alert-akun',
        buttons: [{
          text: 'CANCEL',
          role: 'Cancel'
        }, {
          text: 'YES',
          handler: () => {
            var data = this.globalService.StartProcessTicket(approvalTicketData);
            this.SubscribeStartProcessTicket(data);
          }
        }]
      }).then(alert => {
        return alert.present();
      });
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }

  private SubscribeStartProcessTicket(data: Observable<any>) {
    data.subscribe(
      (data: any) => {
        if (data.isSuccess) {
          this.globalService.PresentToast("Berhasil Memulai Proses Tiket");
          this.modalController.dismiss(
            { dataPassing: "STARTTICKET" },
            'confirm'
          );
        }
        else {
          this.globalService.PresentToast(data.message);
          this.modalController.dismiss(
            { dataPassing: "GAGALTICKET" },
            'confirm'
          );
        }
      }
    );
  }

  public async RejectTicket(approvalTicketData) {
    try {
      await this.alertController.create({
        mode: 'ios',
        message: 'Apakah Anda Yakin Ingin Menolak Tiket Tersebut? Pilih alasannya!',
        inputs: [{
          label: this.globalService.optionRejectTicketPermohonanData[0],
          value: this.globalService.optionRejectTicketPermohonanData[0],
          type: 'radio',
        }, {
          label: this.globalService.optionRejectTicketPermohonanData[1],
          value: this.globalService.optionRejectTicketPermohonanData[1],
        }, {
          label: this.globalService.optionRejectTicketPermohonanData[2],
          value: this.globalService.optionRejectTicketPermohonanData[2],
        },],
        buttons: [{
          text: 'CANCEL',
          role: 'Cancel',
        }, {
          text: 'OK',
          handler: (alertData) => {
            this.globalService.FinishOrRejectTicket(approvalTicketData, 1, this.modalController, alertData);
            console.log(alertData);
          }
        }]
      }).then(alert => {
        return alert.present();
      });
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }

  public async FinishTicket(approvalTicketData) {
    try {
      await this.alertController.create({
        mode: 'ios',
        message: 'Apakah Anda Yakin Ingin Menyelesaikan Tiket Tersebut? Jelaskan Rincian Balasan!',
        inputs: [{
          placeholder: 'Masukkan Balasan',
          type: 'textarea',
        }],
        buttons: [{
          text: 'CANCEL',
          role: 'Cancel',
        }, {
          text: 'OK',
          handler: (alertData) => {
            this.globalService.FinishOrRejectTicket(approvalTicketData, 0, this.modalController, alertData[0] ? alertData[0] : alertData);
          }
        }]
      }).then(alert => {
        return alert.present();
      });
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }
}
