import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { BLANKPAGE_KEY } from 'src/app/guards/standard.guard';
import { GlobalService } from 'src/app/services/global.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-blank-loading',
  templateUrl: './blank-loading.page.html',
  styleUrls: ['./blank-loading.page.scss'],
})
export class BlankLoadingPage implements OnInit {
  isAdmin: boolean = false;

  constructor(private loadingController: LoadingController,
    private globalService: GlobalService,
    private router: Router) {
    this.InitializeData();
  }

  async InitializeData() {
    const loading = await this.PresentLoading();

    if (await this.globalService.GetUserDataFromStorage()) {
      if (this.globalService.GetListPekerjaan()) {
        if (this.globalService.userData.md_user_admin == "TRUE") {
          // if (this.globalService.GetListUserApproval()) {
          //   if (this.globalService.GetListTicketApproval()) {
          // if (this.globalService.GetListTicketData()){
          await Storage.set({ key: BLANKPAGE_KEY, value: 'true' });
          await loading.dismiss();
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
          // }
          //   }
          // }
        } else {
          await Storage.set({ key: BLANKPAGE_KEY, value: 'true' });
          await loading.dismiss();
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
      }
    }


  }

  private async PresentLoading() {
    const loading = await this.loadingController.create({
      mode: "ios",
      spinner: "circles"
    });
    await loading.present();
    return loading;
  }

  async ngOnInit() { }
}
