import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService, TicketData, UserData } from 'src/app/services/global.service';

@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.scss'],
})
export class UserApprovalComponent implements OnInit {

  // Data passed in by componentProps
  public approvalUserData: UserData;
  // public userData: UserData;
  // public isPermohonan: boolean = false;
  // public isKeberatan: boolean = false;
  // public statusColor: string;

  constructor(private navParams: NavParams,
    private globalService: GlobalService,
    private modalController: ModalController,
    private alertController: AlertController) {

  }

  ngOnInit() {
    this.approvalUserData = this.navParams.get('approvalUserData');
    // this.userData = this.globalService.userData;
    // this.isPermohonan = this.approvalUserData.trx_ticket_tipe == this.globalService.ticketTypeData.PERMOHONANINFORMASI ? true : false;
    // this.isKeberatan = this.approvalUserData.trx_ticket_tipe == this.globalService.ticketTypeData.PENGAJUANKEBERATAN ? true : false;
    // this.statusColor = this.approvalUserData.trx_ticket_status == this.globalService.statusTransaksiData.OPEN ? "orangered" :
    //   this.approvalUserData.trx_ticket_status == this.globalService.statusTransaksiData.INPROGRESS ? "yellow" :
    //     this.approvalUserData.trx_ticket_status == this.globalService.statusTransaksiData.CLOSE ? "green" : "black";
  }

  public CloseUserApproval() {
    this.modalController.dismiss(
      { dataPassing: "JUSTCANCEL" },
      'backdrop'
    );
  }

  public ApproveUser(approvalUserData) {
    try {
      this.globalService.ApproveOrRejectUser(approvalUserData.md_user_id, 0, this.modalController);
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }

  public async RejectUser(approvalUserData) {
    try {
      await this.alertController.create({
        mode: 'ios',
        message: 'Apakah Anda Yakin Ingin Membatalkan Tiket Tersebut? Pilih alasannya!',
        inputs: [{
          label: 'Identitas tidak sesuai lampiran',
          value: 'Identitas tidak sesuai lampiran.',
          type: 'radio'
        }, {
          label: 'Foto lampiran kurang jelas',
          value: 'Foto lampiran kurang jelas.',
        }, {
          label: 'Institusi tidak terdaftar',
          value: 'Institusi tidak terdaftar.',
        },],
        buttons: [{
          text: 'OK',
          handler: (alertData) => {
            this.globalService.ApproveOrRejectUser(approvalUserData.md_user_id, 1, this.modalController, alertData);
            console.log(alertData);
          }
        }, {
          text: 'CANCEL',
          role: 'Cancel',
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
