import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'permohonan-informasi',
    loadChildren: () => import('./pages/permohonan-informasi/permohonan-informasi.module').then( m => m.PermohonanInformasiPageModule)
  },
  {
    path: 'pengajuan-keberatan',
    loadChildren: () => import('./pages/pengajuan-keberatan/pengajuan-keberatan.module').then( m => m.PengajuanKeberatanPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./pages/information/information.module').then( m => m.InformationPageModule)
  },
  // {
  //   path: 'tabs',
  //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  // },
  // {
  //   path: 'tracking',
  //   loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
