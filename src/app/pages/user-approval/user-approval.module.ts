import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserApprovalPageRoutingModule } from './user-approval-routing.module';

import { UserApprovalPage } from './user-approval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserApprovalPageRoutingModule
  ],
  declarations: [UserApprovalPage]
})
export class UserApprovalPageModule {}
