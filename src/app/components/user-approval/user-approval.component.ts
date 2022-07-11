import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService, TicketData, UserData } from 'src/app/services/global.service';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-user-approval',
  templateUrl: './user-approval.component.html',
  styleUrls: ['./user-approval.component.scss'],
})
export class UserApprovalComponent implements OnInit {

  public approvalUserData: UserData;
  public approvalUserDataExtendList: UserData;
  public isJustView: boolean = false;
  public photo: any;

  constructor(private navParams: NavParams,
    private globalService: GlobalService,
    private modalController: ModalController,
    private alertController: AlertController,
    private photoService: PhotoService) {

  }

  ngOnInit() {
    if (this.navParams.get('approvalUserData')) this.approvalUserData = this.navParams.get('approvalUserData');
    if (this.navParams.get('userData')) {
      this.approvalUserData = this.navParams.get('userData');
      this.isJustView = true;
    }

    this.photo = this.photoService.ConvertPhotoBase64ToImage(this.approvalUserData.md_user_ktp_data);
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
          label: this.globalService.optionRejectUserApprovalData[0],
          value: this.globalService.optionRejectUserApprovalData[0],
          type: 'radio'
        }, {
          label: this.globalService.optionRejectUserApprovalData[1],
          value: this.globalService.optionRejectUserApprovalData[1],
        }, {
          label: this.globalService.optionRejectUserApprovalData[2],
          value: this.globalService.optionRejectUserApprovalData[2],
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
