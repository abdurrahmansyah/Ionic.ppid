import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserApprovalPage } from './user-approval.page';

const routes: Routes = [
  {
    path: '',
    component: UserApprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserApprovalPageRoutingModule {}
