import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'permohonan-informasi',
    loadChildren: () => import('./pages/permohonan-informasi/permohonan-informasi.module').then( m => m.PermohonanInformasiPageModule)
  },
  {
    path: 'pengajuan-keberatan',
    loadChildren: () => import('./pages/pengajuan-keberatan/pengajuan-keberatan.module').then( m => m.PengajuanKeberatanPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
