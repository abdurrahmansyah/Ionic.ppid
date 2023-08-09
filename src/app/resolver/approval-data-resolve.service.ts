import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GlobalService, TicketData, TicketDataExtend, UserData } from '../services/global.service';
import { LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApprovalDataResolveService implements Resolve<any> {

  constructor(private globalService: GlobalService, private loadingCtrl: LoadingController) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const loading = await this.loadingCtrl.create({
      mode: "ios",
      spinner: "circles"
    });
    loading.present();

    if (this.globalService.userData.md_user_admin == "TRUE") {
      var data = this.globalService.GetApprovalData();
      return new Promise(resolve => {
        data.pipe(
          take(1) //useful if you need the data once and don't want to manually cancel the subscription again
        )
          .subscribe(
            (data: any) => {
              if (data.isSuccess) {
                console.log("Log : Run Api getApprovalData berhasil");
                console.log('ticketApproval', data.ticketApproval.length);
                console.log('userApproval', data.userApproval.length);
                console.log('totalApprovalData', data.ticketApproval.length + data.userApproval.length);


                if (data.userApproval.length > 0) {
                  data.userApproval.forEach(approvalUserDataFromDb => {
                    var userData = new UserData();

                    userData.md_user_id = approvalUserDataFromDb.id.toString();
                    userData.md_user_name = approvalUserDataFromDb.md_user_name;
                    userData.md_user_email = approvalUserDataFromDb.md_user_email;
                    userData.md_user_email_verified_at = approvalUserDataFromDb.md_user_email_verified_at;
                    userData.md_user_telp = approvalUserDataFromDb.md_user_telp;
                    userData.md_user_ktp = approvalUserDataFromDb.md_user_ktp;
                    userData.md_user_ktp_data = approvalUserDataFromDb.md_user_ktp_data;
                    userData.md_user_npwp = approvalUserDataFromDb.md_user_npwp ? approvalUserDataFromDb.md_user_npwp : "-";
                    userData.md_user_pekerjaan_id = approvalUserDataFromDb.md_user_pekerjaan_id.toString();
                    userData.md_user_address = approvalUserDataFromDb.md_user_address;
                    userData.md_user_instution = approvalUserDataFromDb.md_user_instution;
                    userData.md_user_password = approvalUserDataFromDb.md_user_password;
                    userData.md_user_admin = approvalUserDataFromDb.md_user_admin;
                    userData.md_user_status = approvalUserDataFromDb.md_user_status;
                    userData.md_user_date_created = approvalUserDataFromDb.created_at.split(' ')[0];
                    userData.md_user_date_modified = approvalUserDataFromDb.updated_at.split(' ')[0];
                    userData.md_user_last_login = approvalUserDataFromDb.md_user_last_login;
                    userData.pekerjaanData.md_pekerjaan_id = approvalUserDataFromDb.md_pekerjaan_id.toString();
                    userData.pekerjaanData.md_pekerjaan_name = approvalUserDataFromDb.md_pekerjaan_name;

                    this.globalService.approvalUserDataList.push(userData);
                    this.globalService.totalApproval = (+this.globalService.totalApproval + 1).toString();
                  });
                  this.globalService.isNoUser = false;
                } else {
                  this.globalService.isNoUser = true;
                }

                if (data.ticketApproval.length > 0) {
                  data.ticketApproval.forEach(approvalTicketeDataFromDb => {
                    var ticketData = new TicketData();

                    ticketData.trx_ticket_id = approvalTicketeDataFromDb.trx_ticket_id.toString();
                    ticketData.trx_ticket_user_id = approvalTicketeDataFromDb.trx_ticket_user_id.toString();
                    ticketData.trx_ticket_date_created = approvalTicketeDataFromDb.trx_ticket_date_created ? approvalTicketeDataFromDb.trx_ticket_date_created.split(' ')[0] : "-";
                    ticketData.trx_ticket_date_respond = approvalTicketeDataFromDb.trx_ticket_date_respond ? approvalTicketeDataFromDb.trx_ticket_date_respond.split(' ')[0] : "-";
                    ticketData.trx_ticket_date_closed = approvalTicketeDataFromDb.trx_ticket_date_closed ? approvalTicketeDataFromDb.trx_ticket_date_closed.split(' ')[0] : "-";
                    ticketData.trx_ticket_tipe = approvalTicketeDataFromDb.trx_ticket_tipe;
                    ticketData.trx_ticket_reference_id = approvalTicketeDataFromDb.trx_ticket_reference_id ? approvalTicketeDataFromDb.trx_ticket_reference_id.toString() : null;
                    ticketData.trx_ticket_tujuan_alasan = approvalTicketeDataFromDb.trx_ticket_tujuan_alasan;
                    ticketData.trx_ticket_jenis = approvalTicketeDataFromDb.trx_ticket_jenis;
                    ticketData.trx_ticket_rincian = approvalTicketeDataFromDb.trx_ticket_rincian;
                    ticketData.trx_ticket_cara = approvalTicketeDataFromDb.trx_ticket_cara;
                    ticketData.trx_ticket_lampiran = approvalTicketeDataFromDb.trx_ticket_lampiran;
                    ticketData.trx_ticket_replyadmin = approvalTicketeDataFromDb.trx_ticket_replyadmin;
                    ticketData.trx_ticket_rating = approvalTicketeDataFromDb.trx_ticket_rating;
                    ticketData.trx_ticket_status = this.globalService.CapitalizeEachWord(approvalTicketeDataFromDb.trx_ticket_status);
                    ticketData.trx_ticket_user_data.md_user_id = approvalTicketeDataFromDb.id.toString();
                    ticketData.trx_ticket_user_data.md_user_name = approvalTicketeDataFromDb.md_user_name;
                    ticketData.trx_ticket_user_data.md_user_email = approvalTicketeDataFromDb.md_user_email;
                    ticketData.trx_ticket_user_data.md_user_email_verified_at = approvalTicketeDataFromDb.md_user_email_verified_at;
                    ticketData.trx_ticket_user_data.md_user_telp = approvalTicketeDataFromDb.md_user_telp;
                    ticketData.trx_ticket_user_data.md_user_ktp = approvalTicketeDataFromDb.md_user_ktp;
                    ticketData.trx_ticket_user_data.md_user_ktp_data = approvalTicketeDataFromDb.md_user_ktp_data;
                    ticketData.trx_ticket_user_data.md_user_npwp = approvalTicketeDataFromDb.md_user_npwp ? approvalTicketeDataFromDb.md_user_npwp : "-";
                    ticketData.trx_ticket_user_data.md_user_pekerjaan_id = approvalTicketeDataFromDb.md_user_pekerjaan_id.toString();
                    ticketData.trx_ticket_user_data.md_user_address = approvalTicketeDataFromDb.md_user_address;
                    ticketData.trx_ticket_user_data.md_user_instution = approvalTicketeDataFromDb.md_user_instution;
                    ticketData.trx_ticket_user_data.md_user_password = approvalTicketeDataFromDb.md_user_password;
                    ticketData.trx_ticket_user_data.md_user_admin = approvalTicketeDataFromDb.md_user_admin;
                    ticketData.trx_ticket_user_data.md_user_status = approvalTicketeDataFromDb.md_user_status;
                    ticketData.trx_ticket_user_data.md_user_date_created = approvalTicketeDataFromDb.created_at;
                    ticketData.trx_ticket_user_data.md_user_date_modified = approvalTicketeDataFromDb.updated_at;
                    ticketData.trx_ticket_user_data.md_user_last_login = approvalTicketeDataFromDb.md_user_last_login;
                    ticketData.trx_ticket_user_data.pekerjaanData.md_pekerjaan_id = approvalTicketeDataFromDb.md_pekerjaan_id.toString();
                    ticketData.trx_ticket_user_data.pekerjaanData.md_pekerjaan_name = approvalTicketeDataFromDb.md_pekerjaan_name;

                    var diffDays = this.globalService.GetDiffDays(ticketData);

                    var ticketDataExtend: TicketDataExtend = { ticketData: ticketData, sisaHari: diffDays };
                    this.globalService.approvalTicketDataExtendList.push(ticketDataExtend);
                    this.globalService.approvalTicketDataList.push(ticketData);
                    this.globalService.totalApproval = (+this.globalService.totalApproval + 1).toString();
                  });
                  this.globalService.isNoTicket = false;
                } else {
                  this.globalService.isNoTicket = true;
                }
              }
              else {
                console.log(data.message);
              }
              loading.dismiss();
              resolve('approvalData');
            })
      });
    } else {
      loading.dismiss();
      return true;
    }
  }
}
