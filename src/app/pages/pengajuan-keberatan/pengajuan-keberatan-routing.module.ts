import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PengajuanKeberatanPage } from './pengajuan-keberatan.page';

const routes: Routes = [
  {
    path: '',
    component: PengajuanKeberatanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PengajuanKeberatanPageRoutingModule {}
