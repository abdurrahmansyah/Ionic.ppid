import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PermohonanInformasiPage } from './permohonan-informasi.page';

const routes: Routes = [
  {
    path: '',
    component: PermohonanInformasiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermohonanInformasiPageRoutingModule {}
