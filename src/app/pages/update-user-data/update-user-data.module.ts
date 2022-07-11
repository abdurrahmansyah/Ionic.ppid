import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateUserDataPageRoutingModule } from './update-user-data-routing.module';

import { UpdateUserDataPage } from './update-user-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateUserDataPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateUserDataPage]
})
export class UpdateUserDataPageModule {}
