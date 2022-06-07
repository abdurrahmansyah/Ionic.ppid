import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketComponent } from './ticket/ticket.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [TicketComponent, OtpComponent],
  exports: [TicketComponent, OtpComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
