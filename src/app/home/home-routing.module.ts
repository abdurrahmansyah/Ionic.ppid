import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
    // children: [
    //   {
    //     path: 'permohonan-informasi',
    //     loadChildren: () => import('../pages/permohonan-informasi/permohonan-informasi.module').then(m => m.PermohonanInformasiPageModule)
    //   },
    //   {
    //     path: 'pengajuan-keberatan',
    //     loadChildren: () => import('../pages/pengajuan-keberatan/pengajuan-keberatan.module').then(m => m.PengajuanKeberatanPageModule)
    //   },
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule { }
