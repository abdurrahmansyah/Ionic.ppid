import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OtpComponent } from '../components/otp/otp.component';
import { TicketApprovalComponent } from '../components/ticket-approval/ticket-approval.component';
import { TicketComponent } from '../components/ticket/ticket.component';
import { UserApprovalComponent } from '../components/user-approval/user-approval.component';
import { UpdateUserDataPage } from '../pages/update-user-data/update-user-data.page';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public txtDayNow: string;
  approvalUserDataList = this.globalService.approvalUserDataList;
  approvalTicketDataList = this.globalService.approvalTicketDataList;
  approvalTicketDataExtendList = this.globalService.approvalTicketDataExtendList;
  isNoUser: boolean = this.globalService.isNoUser;
  isNoTicket: boolean = this.globalService.isNoTicket;

  constructor(private globalService: GlobalService,
    private modalController: ModalController) {
    this.InitializeData();
    this.Timer();
  }

  private InitializeData() { }

  private Timer() {
    setInterval(function () {
      this.ShowRepeatData();
    }.bind(this), 500);
  }

  ShowRepeatData() {
    var dateData = this.globalService.GetDate();

    this.txtDayNow = dateData.szDay + ", " + dateData.decDate + " " + dateData.szMonth + " " + dateData.decYear;
  }

  ngOnInit() {
    console.log("Log : Load Page Admin");
  }

  DoRefresh(event?: any) {
    console.log("Log : Do Refresh Page Admin");
    
    this.globalService.GetListUserApproval();
    this.globalService.GetListTicketApproval();
    this.approvalUserDataList = this.globalService.approvalUserDataList;
    this.approvalTicketDataList = this.globalService.approvalTicketDataList;
    this.approvalTicketDataExtendList = this.globalService.approvalTicketDataExtendList;

    this.isNoUser = this.globalService.isNoUser;
    this.isNoTicket = this.globalService.isNoTicket;

    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }

  public async OpenUserApproval(approvalUserData) {
    try {
      const modal = await this.modalController.create({
        component: UserApprovalComponent,
        initialBreakpoint: 0.6,
        breakpoints: [0, 0.6, 0.95],
        mode: 'md',
        componentProps: {
          'approvalUserData': approvalUserData
        }
      });
      // modal.present();
      modal.onDidDismiss().then((modelData) => {
        if (modelData.role == "confirm") {
          if (modelData.data.dataPassing == "SUCCESSAPPROVEORREJECTUSER") {
            this.DoRefresh();
            console.log("Log : Close User Approval");
          }
        } else if (modelData.role == "backdrop") {
          console.log("Log : Close User Approval");
        }
      })

      return await modal.present();
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }

  public async OpenTicketApproval(approvalTicketData) {
    try {
      const modal = await this.modalController.create({
        component: TicketApprovalComponent,
        // initialBreakpoint: 0.6,
        // breakpoints: [0, 0.6, 0.95],
        mode: 'ios',
        componentProps: {
          'rootPage': UpdateUserDataPage,
          'approvalTicketData': approvalTicketData
        }
      });
      // modal.present();
      modal.onDidDismiss().then((modelData) => {
        if (modelData.role == "confirm") {
          if (modelData.data.dataPassing == "STARTTICKET") {
            console.log("Log : Close Ticket Approval");
            this.DoRefresh();
          } else if (modelData.data.dataPassing == "SUCCESSAPPROVEORREJECTTICKET") {
            console.log("Log : Close Ticket Approval");
            this.DoRefresh();
          } else if (modelData.data.dataPassing == "GAGALTICKET") {
            console.log("Log : Close Ticket Approval");
            this.DoRefresh();
          }
        } else if (modelData.role == "backdrop") {
          console.log("Log : Close Ticket Approval");
        }
      })
      console.log("Log : Open Ticket Approval");

      return await modal.present();
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }
}
