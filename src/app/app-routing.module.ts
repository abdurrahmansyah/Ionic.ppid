import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { WelcomeGuard } from './guards/welcome.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [WelcomeGuard, AutoLoginGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
    canLoad:  [AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad:  [AuthGuard]
  },
  {
    path: 'permohonan-informasi',
    loadChildren: () => import('./pages/permohonan-informasi/permohonan-informasi.module').then(m => m.PermohonanInformasiPageModule)
  },
  {
    path: 'pengajuan-keberatan',
    loadChildren: () => import('./pages/pengajuan-keberatan/pengajuan-keberatan.module').then(m => m.PengajuanKeberatanPageModule)
  },
  {
    path: 'information',
    loadChildren: () => import('./pages/information/information.module').then(m => m.InformationPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }


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
