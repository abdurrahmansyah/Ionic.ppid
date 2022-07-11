import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateUserDataPage } from './update-user-data.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateUserDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateUserDataPageRoutingModule {}
