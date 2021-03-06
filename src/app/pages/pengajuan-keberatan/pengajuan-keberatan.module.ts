import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PengajuanKeberatanPageRoutingModule } from './pengajuan-keberatan-routing.module';

import { PengajuanKeberatanPage } from './pengajuan-keberatan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PengajuanKeberatanPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PengajuanKeberatanPage]
})
export class PengajuanKeberatanPageModule {}
