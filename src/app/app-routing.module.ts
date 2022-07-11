import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { StandardGuard } from './guards/standard.guard';
import { WelcomeGuard } from './guards/welcome.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [WelcomeGuard, AutoLoginGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule),
    // canLoad:  [AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    // canLoad: [AuthGuard]
    canLoad: [StandardGuard]
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
    path: 'update-user-data',
    loadChildren: () => import('./pages/update-user-data/update-user-data.module').then(m => m.UpdateUserDataPageModule)
  },
  {
    path: 'user-approval',
    loadChildren: () => import('./pages/user-approval/user-approval.module').then(m => m.UserApprovalPageModule)
  },
  {
    path: 'blank-loading',
    loadChildren: () => import('./pages/blank-loading/blank-loading.module').then(m => m.BlankLoadingPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
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
