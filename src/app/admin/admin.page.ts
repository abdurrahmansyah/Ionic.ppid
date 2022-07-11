import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { InjectorInstance } from '../app.module';
import { OtpComponent } from '../components/otp/otp.component';
import { TicketApprovalComponent } from '../components/ticket-approval/ticket-approval.component';
import { TicketComponent } from '../components/ticket/ticket.component';
import { UserApprovalComponent } from '../components/user-approval/user-approval.component';
import { UpdateUserDataPage } from '../pages/update-user-data/update-user-data.page';
import { GlobalService, TicketData, TicketDataExtend, UserData } from '../services/global.service';
import { TabsPage } from '../tabs/tabs.page';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  public txtDayNow: string;
  public txtJumlahTiketSelesai: string = "0";
  public txtJumlahTiketProses: string = "0";
  public txtTotalTiket: string = "0";
  public txtPersenTiketSelesai: string = "0";
  public txtTiketOntime: string = "0";
  public txtTiketTerlambat: string = "0";
  approvalUserDataList = this.globalService.approvalUserDataList;
  ticketDataList = this.globalService.ticketDataList;
  approvalTicketDataList = this.globalService.approvalTicketDataList;
  approvalTicketDataExtendList = this.globalService.approvalTicketDataExtendList;
  isNoUser: boolean = this.globalService.isNoUser;
  isNoTicket: boolean = this.globalService.isNoTicket;

  httpClient = InjectorInstance.get<HttpClient>(HttpClient);

  constructor(private globalService: GlobalService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private tabsPage: TabsPage) {
    this.InitializeData();
    this.Timer();
  }

  private InitializeData() { }

  private Timer() {
    setInterval(function () {
      this.ShowRepeatData();
    }.bind(this), 500);
  }

  ShowRepeatData() {
    var dateData = this.globalService.GetDate();

    this.txtDayNow = dateData.szDay + ", " + dateData.decDate + " " + dateData.szMonth + " " + dateData.decYear;
  }

  ngOnInit() {
    console.log("Log : Load Page Admin");
  }

  ionViewDidEnter() {
    this.InitializeAnalyticsData(this.ticketDataList);
  }

  private InitializeAnalyticsData(ticketDataList) {
    this.txtJumlahTiketSelesai = '0';
    this.txtJumlahTiketProses = '0';
    this.txtTotalTiket = '0';
    this.txtPersenTiketSelesai = '0';
    this.txtTiketOntime = '0';
    this.txtTiketTerlambat = '0';

    ticketDataList.forEach(ticketData => {
      if (ticketData.trx_ticket_status != this.globalService.statusTransaksiData.DIBATALKAN) {
        this.txtTotalTiket = (+this.txtTotalTiket + 1).toString();
      }
      if (ticketData.trx_ticket_status == this.globalService.statusTransaksiData.OPEN || ticketData.trx_ticket_status == this.globalService.statusTransaksiData.INPROGRESS) {
        this.txtJumlahTiketProses = (+this.txtJumlahTiketProses + 1).toString();
      } else if (ticketData.trx_ticket_status == this.globalService.statusTransaksiData.CLOSE || ticketData.trx_ticket_status == this.globalService.statusTransaksiData.DITOLAK) {
        this.txtJumlahTiketSelesai = (+this.txtJumlahTiketSelesai + 1).toString();
      }

      this.txtPersenTiketSelesai = (Math.ceil(+this.txtJumlahTiketSelesai / +this.txtTotalTiket * 100)).toString();
    });

    var ticketSelesaiDataList = ticketDataList.filter(x => x.trx_ticket_status == this.globalService.statusTransaksiData.CLOSE || x.trx_ticket_status == this.globalService.statusTransaksiData.DITOLAK);
    ticketSelesaiDataList.forEach(ticketSelesaiData => {
      if (this.globalService.GetDiffDays(ticketSelesaiData) < 0)
        this.txtTiketTerlambat = (+this.txtTiketTerlambat + 1).toString();
      if (this.globalService.GetDiffDays(ticketSelesaiData) >= 0)
        this.txtTiketOntime = (+this.txtTiketOntime + 1).toString();
    });
  }


  // InitializeAnalyticsData() {
  //   this.txtJumlahTiketSelesai = this.globalService.txtJumlahTiketSelesai;
  //   this.txtJumlahTiketProses = this.globalService.txtJumlahTiketProses;
  //   this.txtTotalTiket = this.globalService.txtTotalTiket;
  //   this.txtPersenTiketSelesai = this.globalService.txtPersenTiketSelesai;
  //   this.txtTiketOntime = this.globalService.txtTiketOntime;
  //   this.txtTiketTerlambat = this.globalService.txtTiketTerlambat;
  // }

  // DoRefresh2(event?: any) {
  //   console.log("Log : Do Refresh Page Admin");

  //   this.globalService.GetListUserApproval();
  //   this.globalService.GetListTicketApproval();
  //   this.globalService.GetListTicketData();
  //   this.approvalUserDataList = this.globalService.approvalUserDataList;
  //   this.ticketDataList = this.globalService.ticketDataList;
  //   this.approvalTicketDataList = this.globalService.approvalTicketDataList;
  //   this.approvalTicketDataExtendList = this.globalService.approvalTicketDataExtendList;

  //   this.isNoUser = this.globalService.isNoUser;
  //   this.isNoTicket = this.globalService.isNoTicket;

  //   this.InitializeAnalyticsData(this.ticketDataList);

  //   if (event) {
  //     setTimeout(() => {
  //       event.target.complete();
  //     }, 1000);
  //   }
  // }

  async DoRefresh(event?: any) {
    console.log("Log : Do Refresh Page Admin");
    const loading = await this.loadingController.create();
    await loading.present();

    this.approvalUserDataList = [];
    this.globalService.totalApproval = '0';

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.globalService.userData.md_user_token,
      }),
    };

    console.log("Log : Run Api getListUserApproval...");
    var data: any = this.httpClient.get('http://kipdev.hutamakarya.com/api/getListUserApproval', requestOptions);
    data.subscribe(async data => {
      if (data.isSuccess) {
        console.log("Log : Run Api getListUserApproval berhasil");

        data.data.forEach(approvalUserDataFromDb => {
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

          this.approvalUserDataList.push(userData);
          this.globalService.totalApproval = (+this.globalService.totalApproval + 1).toString();
          this.tabsPage.SetTotalApproval();
        });
        this.isNoUser = false;
      }
      else {
        await loading.dismiss();
        console.log(data.message);
        this.isNoUser = true;
      }

      ///////////////////////////////// GetListTicketApproval /////////////////////////////////

      this.approvalTicketDataList = [];
      this.approvalTicketDataExtendList = [];

      console.log("Log : Run Api getListTicketApproval...");
      var data: any = this.httpClient.get('http://kipdev.hutamakarya.com/api/getListTicketApproval', requestOptions);
      data.subscribe(async data => {
        if (data.isSuccess) {
          console.log("Log : Run Api getListTicketApproval berhasil");

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
            this.approvalTicketDataExtendList.push(ticketDataExtend);
            this.approvalTicketDataList.push(ticketData);
            this.globalService.totalApproval = (+this.globalService.totalApproval + 1).toString();
            this.tabsPage.SetTotalApproval();
          });
          this.isNoTicket = false;
        }
        else {
          await loading.dismiss();
          console.log(data.message);
          this.isNoTicket = true;
        }

        ///////////////////////////////// GetListTicketData /////////////////////////////////

        this.ticketDataList = [];

        console.log("Log : Run Api getListTicketData...");
        var data: any = this.httpClient.get('http://kipdev.hutamakarya.com/api/getListTicketData', requestOptions);
        data.subscribe(async (data: { isSuccess: any; data: any[]; message: any; }) => {
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

              this.ticketDataList.push(ticketData);
            });

            this.InitializeAnalyticsData(this.ticketDataList);
            await loading.dismiss();
          }
          else {
            await loading.dismiss();
            console.log(data.message);
          }
        });

        ///////////////////////////////// END GetListTicketData /////////////////////////////////
      });

      ///////////////////////////////// END GetListTicketApproval /////////////////////////////////
    });

    if (event) {
      setTimeout(() => {
        event.target.complete();
      }, 1000);
    }
  }

  public async OpenUserApproval(approvalUserData) {
    try {
      const modal = await this.modalController.create({
        component: UserApprovalComponent,
        initialBreakpoint: 0.6,
        breakpoints: [0, 0.6, 0.95],
        mode: 'md',
        componentProps: {
          'approvalUserData': approvalUserData
        }
      });
      // modal.present();
      modal.onDidDismiss().then((modelData) => {
        if (modelData.role == "confirm") {
          if (modelData.data.dataPassing == "SUCCESSAPPROVEORREJECTUSER") {
            this.DoRefresh();
            console.log("Log : Close User Approval");
          }
        } else if (modelData.role == "backdrop") {
          console.log("Log : Close User Approval");
        }
      })

      return await modal.present();
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }

  public async OpenTicketApproval(approvalTicketData) {
    try {
      const modal = await this.modalController.create({
        component: TicketApprovalComponent,
        // initialBreakpoint: 0.6,
        // breakpoints: [0, 0.6, 0.95],
        mode: 'ios',
        componentProps: {
          'rootPage': UpdateUserDataPage,
          'approvalTicketData': approvalTicketData
        }
      });
      // modal.present();
      modal.onDidDismiss().then((modelData) => {
        if (modelData.role == "confirm") {
          if (modelData.data.dataPassing == "STARTTICKET") {
            console.log("Log : Close Ticket Approval");
            this.DoRefresh();
          } else if (modelData.data.dataPassing == "SUCCESSAPPROVEORREJECTTICKET") {
            console.log("Log : Close Ticket Approval");
            this.DoRefresh();
          } else if (modelData.data.dataPassing == "GAGALTICKET") {
            console.log("Log : Close Ticket Approval");
            this.DoRefresh();
          }
        } else if (modelData.role == "backdrop") {
          console.log("Log : Close Ticket Approval");
        }
      })
      console.log("Log : Open Ticket Approval");

      return await modal.present();
    } catch (e) {
      console.log(e);
      this.globalService.PresentToast(e);
    }
  }
}
