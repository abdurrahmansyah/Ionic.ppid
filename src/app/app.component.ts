import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private globalService: GlobalService) {
    this.InitializeData();
  }

  async InitializeData() {
    if ((await Storage.get({ key: 'md_user_token' })).value) {
      await this.globalService.GetUserDataFromStorage();
      this.globalService.GetListPekerjaan();
      this.globalService.GetListUserApproval();
      this.globalService.GetListTicketApproval();
    }
  }
}
