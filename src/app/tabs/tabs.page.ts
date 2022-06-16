import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  isAdmin: boolean = false;

  constructor(private globalService: GlobalService) {
    this.InitializeApp();
  }

  ngOnInit() {
  }

  InitializeApp() {
    if (this.globalService.userData) this.isAdmin = this.globalService.userData.md_user_admin == "TRUE" ? true : false;
    else this.isAdmin = false;
  }
}
