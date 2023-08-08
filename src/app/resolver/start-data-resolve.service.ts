import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { GlobalService, TicketData } from '../services/global.service';
import { LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StartDataResolveService implements Resolve<any> {
  constructor(private globalService: GlobalService, private loadingCtrl: LoadingController) { }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const loading = await this.loadingCtrl.create({
      mode: "ios",
      spinner: "circles"
    });
    loading.present();

    var data = this.globalService.GetListTicketData();
    // return "Good";
    return new Promise(resolve => {
      data.pipe(
        take(1) //useful if you need the data once and don't want to manually cancel the subscription again
      )
        .subscribe(
          (data: any) => {
            if (data.isSuccess) {
              console.log("Log : Run Api getListTicketData berhasil");

              data.data.forEach(approvalTicketeDataFromDb => {
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
                ticketData.trx_ticket_status = this.CapitalizeEachWord(approvalTicketeDataFromDb.trx_ticket_status);
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

                this.globalService.ticketDataList.push(ticketData);
              });
            }
            else {
              console.log(data.message);
            }
            loading.dismiss();
            console.log(this.globalService.ticketDataList);
            resolve(this.globalService.ticketDataList);
          })
    });
  }

  public CapitalizeEachWord(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string

    return splitStr.join(' ');
  }
}
