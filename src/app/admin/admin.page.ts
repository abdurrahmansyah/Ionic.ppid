import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TicketComponent } from '../components/ticket/ticket.component';
import { UserApprovalComponent } from '../components/user-approval/user-approval.component';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  approvalUserDataList = this.globalService.approvalUserDataList;

  constructor(private globalService: GlobalService,
    private modalController: ModalController) {
    this.InitializeData();
  }

  private InitializeData() { }

  ngOnInit() { }

  DoRefresh(event?: any) {
    this.globalService.GetListUserApproval();
    this.approvalUserDataList = this.globalService.approvalUserDataList;

    if (event){
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }

  public async OpenApproval(approvalUserData) {
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
          }
        }
      })

      return await modal.present();
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }
}
