import { Component } from '@angular/core';
import { GlobalService } from './services/global.service';

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
    await this.globalService.GetUserDataFromStorage();
    this.globalService.GetListPekerjaan();
    this.globalService.GetListUserApproval();
  }
}
