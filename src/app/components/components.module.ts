import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketComponent } from './ticket/ticket.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { UserApprovalComponent } from './user-approval/user-approval.component';
import { TicketApprovalComponent } from './ticket-approval/ticket-approval.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
  declarations: [TicketComponent, OtpComponent, EmailVerificationComponent, UserApprovalComponent, TicketApprovalComponent, ForgetPasswordComponent],
  exports: [TicketComponent, OtpComponent, EmailVerificationComponent, UserApprovalComponent, TicketApprovalComponent, ForgetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule { }
