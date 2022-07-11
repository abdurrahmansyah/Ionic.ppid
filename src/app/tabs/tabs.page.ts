import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  isAdmin: boolean = false;
  isAnyApproval: boolean = false;
  txtTotalApproval: string;

  constructor(private globalService: GlobalService) {
    this.InitializeApp();
  }

  ngOnInit() {
  }

  InitializeApp() {
    if (this.globalService.userData) this.isAdmin = this.globalService.userData.md_user_admin == "TRUE" ? true : false;
    else this.isAdmin = false;
  }

  ionViewDidEnter() {
    this.SetTotalApproval();
  }

  public SetTotalApproval() {
    if (this.globalService.totalApproval) {
      this.isAnyApproval = true;
      this.txtTotalApproval = this.globalService.totalApproval;
    } else this.isAnyApproval = false;
  }
}
