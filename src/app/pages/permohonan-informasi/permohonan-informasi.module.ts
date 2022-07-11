import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PermohonanInformasiPageRoutingModule } from './permohonan-informasi-routing.module';

import { PermohonanInformasiPage } from './permohonan-informasi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PermohonanInformasiPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PermohonanInformasiPage]
})
export class PermohonanInformasiPageModule {}
