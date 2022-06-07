import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  approvalUserDataList = this.globalService.approvalUserDataList;

  constructor(private globalService: GlobalService) {
    this.InitializeData();
  }

  private InitializeData() {
    console.log(this.approvalUserDataList);
  }

  ngOnInit() {
  }

  OpenApproval() {

  }
}
