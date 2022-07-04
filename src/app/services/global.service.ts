import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ModalOptions, ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InjectorInstance } from '../app.module';
import { AuthFirebaseService } from './auth-firebase.service';
import { EmailVerificationComponent } from '../components/email-verification/email-verification.component';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  IndexPageData: IndexPage;
  private token: any;
  public userData: UserData;
  public statusUserData = new StatusUserData;
  public statusTransaksiData = new StatusTransaksiData;
  public ticketTypeData = new TicketTypeData;
  public optionRejectUserApprovalData = new OptionRejectUserApprovalData;
  public optionRejectTicketPermohonanData = new OptionRejectTicketPermohonanData;
  public isSeenAlertPPID: boolean = false;
  urlDEVDACTIC = 'http://localhost:3000';

  httpClient = InjectorInstance.get<HttpClient>(HttpClient);
  public pekerjaanDataList = [];
  public ticketDataList = [];
  public approvalUserDataList = [];
  public approvalTicketDataList = [];
  public approvalTicketDataExtendList = [];
  public acuanTicketData: TicketData;
  public isUpdateAccountSuccess: boolean;
  public isNoUser: boolean = false;
  public isNoTicket: boolean = false;

  constructor(private authService: AuthenticationService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController,
    private authFirebaseService: AuthFirebaseService) {
    this.IndexPageData = new IndexPage();
  }

  public GetDate(): DateData {
    var dateData = new DateData();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var date = new Date();

    dateData.date = date;
    dateData.decYear = date.getFullYear();
    dateData.szMonth = months[date.getMonth()];
    dateData.decMonth = date.getMonth() + 1;
    dateData.decDate = date.getDate();
    dateData.szDay = days[date.getDay()];
    dateData.decMinute = date.getMinutes();
    dateData.szMinute = dateData.decMinute < 10 ? "0" + dateData.decMinute : dateData.decMinute.toString();
    dateData.decHour = date.getHours();
    dateData.szHour = dateData.decHour < 10 ? "0" + dateData.decHour : dateData.decHour.toString();
    dateData.decSec = date.getSeconds();
    dateData.szAMPM = dateData.decHour > 12 ? "PM" : "AM";

    return dateData;
  }
  public async Login(credentials: { email, password }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_email', credentials.email);
    postdata.append('password', credentials.password);

    // var url = 'http://sihk.hutamakarya.com/apippid/loginppid.php';
    var url = 'http://kipdev.hutamakarya.com/api/login';

    this.http.post(url, postdata).subscribe(
      async (data: any) => {
        console.log("Log : Run Api login...");

        if (data.isSuccess) {
          await this.authFirebaseService.signInWithEmailAndPassword(credentials.email, credentials.password).then(async (userCredential) => {
            if (userCredential.user.emailVerified) {
              // if (true) {
              await this.MappingUserData(data);

              this.authService.login(data.token);
              await loading.dismiss();
              this.PresentToast("Login Berhasil");
              this.router.navigate(['blank-loading']);
              console.log("Log : Login Berhasil");
            } else {
              await loading.dismiss();

              const options: ModalOptions = {
                component: EmailVerificationComponent,
                initialBreakpoint: 0.75,
                breakpoints: [0, 0.75, 0.95],
                mode: 'md',
                componentProps: {
                  user: userCredential.user
                },
                swipeToClose: true
              };
              const modal = this.modalController.create(options);
              (await modal).present();
              const data: any = (await modal).onWillDismiss();

            }
          }).catch(async (error) => {
            await loading.dismiss();
            var error_msg = error.split('(')[1];
            error_msg = error_msg.split(')')[0];

            console.log("Log : " + error);
            console.log("Log : " + error_msg);
            this.PresentToast("Login Gagal! " + error_msg);
          })
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.message);
        }
      }, async (error: any) => {
        await loading.dismiss();
        this.PresentToast("BUG: Error Connection");
        // this.PresentAlert(JSON.stringify(error));
      }
    );
  }

  private async MappingUserData(data: any) {
    var userDataFromDb = data.data;

    await Storage.set({ key: 'md_user_token', value: data.token });
    await Storage.set({ key: 'md_user_id', value: userDataFromDb.id.toString() });
    await Storage.set({ key: 'md_user_name', value: userDataFromDb.md_user_name });
    await Storage.set({ key: 'md_user_email', value: userDataFromDb.md_user_email });
    await Storage.set({ key: 'md_user_email_verified_at', value: userDataFromDb.md_user_email_verified_at });
    await Storage.set({ key: 'md_user_telp', value: userDataFromDb.md_user_telp });
    await Storage.set({ key: 'md_user_ktp', value: userDataFromDb.md_user_ktp == null ? "" : userDataFromDb.md_user_ktp });
    await Storage.set({ key: 'md_user_npwp', value: userDataFromDb.md_user_npwp == null ? "" : userDataFromDb.md_user_npwp });
    await Storage.set({ key: 'md_user_pekerjaan_id', value: userDataFromDb.md_user_pekerjaan_id == null ? "" : userDataFromDb.md_user_pekerjaan_id.toString() });
    await Storage.set({ key: 'md_user_address', value: userDataFromDb.md_user_address == null ? "" : userDataFromDb.md_user_address });
    await Storage.set({ key: 'md_user_instution', value: userDataFromDb.md_user_instution == null ? "" : userDataFromDb.md_user_instution });
    await Storage.set({ key: 'md_user_admin', value: userDataFromDb.md_user_admin });
    await Storage.set({ key: 'md_user_status', value: userDataFromDb.md_user_status });
    await Storage.set({ key: 'md_user_date_created', value: userDataFromDb.created_at });
    await Storage.set({ key: 'md_user_date_modified', value: userDataFromDb.updated_at });
    await Storage.set({ key: 'md_user_last_login', value: userDataFromDb.md_user_last_login });
  }

  public async Register(credentials: { name, email, telp, password, confirmPassword }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_name', credentials.name);
    postdata.append('md_user_email', credentials.email);
    postdata.append('md_user_telp', credentials.telp);
    postdata.append('password', credentials.password);
    postdata.append('password_confirmation', credentials.confirmPassword);
    postdata.append('md_user_admin', 'FALSE');
    postdata.append('md_user_status', this.statusUserData.KYCREQUIRED);

    // var url = 'http://sihk.hutamakarya.com/apippid/registerppid.php';
    var url = 'http://kipdev.hutamakarya.com/api/register';

    this.http.post(url, postdata).subscribe(
      async (data: any) => {
        if (data.isSuccess) {
          await this.authFirebaseService.createUserWithEmailAndPassword(credentials.email, credentials.password).then(async (userCredential) => {
            await loading.dismiss();
            this.PresentToast(data.message);

            const options: ModalOptions = {
              component: EmailVerificationComponent,
              initialBreakpoint: 0.75,
              breakpoints: [0, 0.75, 0.95],
              mode: 'md',
              componentProps: {
                user: userCredential.user
              },
              swipeToClose: true
            };
            const modal = await this.modalController.create(options);
            modal.onDidDismiss().then((modelData) => {
              if (modelData.role == "backdrop") {
                let navigationExtras: NavigationExtras = {
                  state: {
                    emailLog: credentials.email
                  }
                }
                this.router.navigate(['login'], navigationExtras);
              }
            })

            return await modal.present();
          }
          ).catch(async (error) => {
            //// JALANKAN PROGRAM HAPUS EMAIL YANG BARUSAN DIDAFTARKAN DARI POSTGRE
            await this.DeleteAccountById(data.data, loading);
            // await loading.dismiss();
            this.PresentToast("Gagal Melakuan Registrasi!");
          }
          );
        }
        else {
          await loading.dismiss();
          this.PresentToast(data.message);
        }
      }, async (error: any) => {
        this.loadingController.dismiss();
        var error_msg = error.error.md_user_email[0] ? "Gagal! Email Sudah Terdaftar" :
          error.error.md_user_email[0] ? "Email Tidak Boleh Kosong" :
            error.error.password[0] ? "Password Tidak Boleh Kosong" :
              error.error.md_user_telp[0] ? "No HP Tidak Boleh Kosong" :
                error.error.md_user_admin[0] ? "Status Admin Tidak Boleh Kosong" :
                  error.error.md_user_status[0] ? "Status Tidak Boleh Kosong" : "BUG: Gagal Register";

        await loading.dismiss();
        this.PresentToast(error_msg);
      }
    );
  }

  public async DeleteAccountById(dataUser, loading) {
    let postdata = new FormData();
    postdata.append('md_user_id', dataUser.id);

    var url = 'http://kipdev.hutamakarya.com/api/deleteAccountById';

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(async data => {
      if (data.isSuccess) {
        console.log("Log : Berhasil menghapus data user baru");
        await loading.dismiss();
      } else {
        console.log("Log : Gagal menghapus data user baru");
        await loading.dismiss();
      }
    });
  }

  public async UpdateAccount(credentials: { telp, ktp, ktp_data, npwp, pekerjaan, alamat, institusi }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_token', this.userData.md_user_token);
    postdata.append('md_user_id', this.userData.md_user_id);
    postdata.append('md_user_telp', credentials.telp);
    postdata.append('md_user_ktp', credentials.ktp);
    postdata.append('md_user_ktp_data', credentials.ktp_data);
    postdata.append('md_user_npwp', credentials.npwp);
    postdata.append('md_user_pekerjaan_id', credentials.pekerjaan);
    postdata.append('md_user_address', credentials.alamat);
    postdata.append('md_user_instution', credentials.institusi);
    postdata.append('md_user_admin', this.userData.md_user_admin);
    postdata.append('md_user_status', this.statusUserData.KYCWAITINGAPPROVAL);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/checkIsNikExist';

    this.http.post(url, postdata, requestOptions).subscribe(
      async (data: any) => {
        if (data.isSuccess) {
          await loading.dismiss();
          this.isUpdateAccountSuccess = false;
          this.PresentToast("Update akun gagal! " + data.message);
        } else {
          // var url = 'http://sihk.hutamakarya.com/apippid/updateAccount.php';
          var url = 'http://kipdev.hutamakarya.com/api/updateAccount';

          this.http.post(url, postdata, requestOptions).subscribe(
            async (data: any) => {
              if (data.isSuccess) {
                await this.MappingUserData(data);

                await loading.dismiss();
                this.isUpdateAccountSuccess = true;
                this.PresentToast("Update Akun Berhasil");

                let navigationExtras: NavigationExtras = {
                  state: {
                    isUpdateAccountSuccess: true
                  }
                }
                this.router.navigate(['tabs'], navigationExtras);
              }
              else {
                await loading.dismiss();
                this.isUpdateAccountSuccess = false;
                this.PresentToast(data.message);
              }
            }, async (err) => {
              await loading.dismiss();
              this.isUpdateAccountSuccess = false;
              this.PresentToast("BUG: " + err?.message);
            }
          )
        }
      }, async (err) => {
        await loading.dismiss();
        this.isUpdateAccountSuccess = false;
        this.PresentToast("BUG: " + err?.message);
      }
    )
  }

  public async ApproveOrRejectUser(id: any, approvalId: number, modalController: ModalController, reasonForReject?) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_token', this.userData.md_user_token);
    postdata.append('md_user_id', id);
    postdata.append('md_user_status', approvalId == 0 ? this.statusUserData.KYCVERIFIED : this.statusUserData.KYCREJECTED + "_" + reasonForReject);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/approveOrRejectUser';

    this.http.post(url, postdata, requestOptions).subscribe(
      async (data: any) => {
        if (data.isSuccess) {
          await loading.dismiss();
          this.PresentToast(approvalId == 0 ? "Berhasil melakukan persetujuan user" : "Berhasil melakukan penolakan user");
          modalController.dismiss(
            { dataPassing: "SUCCESSAPPROVEORREJECTUSER" },
            'confirm'
          );
        }
        else {
          await loading.dismiss();
          this.PresentToast(data.message);
          modalController.dismiss(
            { dataPassing: "JUSTCANCEL" },
            'backdrop'
          );
        }
      }, async (err) => {
        await loading.dismiss();
        this.PresentToast("BUG: " + err?.message);
        modalController.dismiss(
          { dataPassing: "JUSTCANCEL" },
          'backdrop'
        );
      }
    )
  }

  public async GetUserById() {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_token', this.userData.md_user_token);
    postdata.append('md_user_id', this.userData.md_user_id);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/getUserById';

    this.http.post(url, postdata, requestOptions).subscribe(
      async (data: any) => {
        if (data.isSuccess) {
          await this.MappingUserData(data);

          await loading.dismiss();
          await this.GetUserDataFromStorage();
          this.PresentToast("Refresh Akun Berhasil");
          // this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.message);
        }
      }, async (err) => {
        await loading.dismiss();
        this.PresentToast("BUG: " + err?.message);
      }
    )
  }

  public async CreatePermohonanInformasi(credentials: { tujuan, jenis, rincian, cara, lampiran }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('trx_ticket_user_id', this.userData.md_user_id);
    postdata.append('trx_ticket_tipe', this.ticketTypeData.PERMOHONANINFORMASI);
    postdata.append('trx_ticket_tujuan_alasan', credentials.tujuan);
    postdata.append('trx_ticket_jenis', credentials.jenis);
    postdata.append('trx_ticket_rincian', credentials.rincian);
    postdata.append('trx_ticket_cara', credentials.cara);
    postdata.append('trx_ticket_lampiran', credentials.lampiran);
    postdata.append('trx_ticket_status', this.statusTransaksiData.OPEN);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    // var url = 'http://sihk.hutamakarya.com/apippid/createPermohonan.php';
    var url = 'http://kipdev.hutamakarya.com/api/createPermohonan';

    this.http.post(url, postdata, requestOptions).subscribe(
      async (data: any) => {
        if (data.isSuccess) {

          await loading.dismiss();
          this.PresentToast(data.message);
          this.router.navigate(['tabs']);
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.message);
        }
      }
    );
  }

  public async CreateAjuanKeberatan(credentials: { acuan, alasan, rincian, lampiran }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('trx_ticket_user_id', this.userData.md_user_id);
    postdata.append('trx_ticket_tipe', this.ticketTypeData.PENGAJUANKEBERATAN);
    postdata.append('trx_ticket_reference_id', credentials.acuan);
    postdata.append('trx_ticket_tujuan_alasan', credentials.alasan);
    postdata.append('trx_ticket_rincian', credentials.rincian);
    postdata.append('trx_ticket_lampiran', credentials.lampiran);
    postdata.append('trx_ticket_status', this.statusTransaksiData.OPEN);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/createAjuanKeberatan';

    this.http.post(url, postdata, requestOptions).subscribe(
      async (data: any) => {
        if (data.isSuccess) {

          await loading.dismiss();
          this.PresentToast(data.message);
          this.router.navigate(['tabs']);
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.message);
        }
      }
    );
  }

  public GetListPekerjaan() {
    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    // var url = 'http://sihk.hutamakarya.com/apippid/getListPekerjaan.php';
    var url = 'http://kipdev.hutamakarya.com/api/getListPekerjaan';

    var data: any = this.httpClient.get(url, requestOptions);
    data.subscribe(data => {
      data.data.forEach(pekerjaanDataFromDb => {
        var pekerjaanData = new PekerjaanData();

        pekerjaanData.md_pekerjaan_id = pekerjaanDataFromDb.id.toString();
        pekerjaanData.md_pekerjaan_name = pekerjaanDataFromDb.md_pekerjaan_name;
        this.pekerjaanDataList.push(pekerjaanData);
      });
    });

    return true;
  }

  public GetListUserApproval() {
    console.log("Log : Run Api getListUserApproval...");
    this.approvalUserDataList = [];

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    // var url = 'http://sihk.hutamakarya.com/apippid/getListUserApproval.php';
    var url = 'http://kipdev.hutamakarya.com/api/getListUserApproval';

    var data: any = this.httpClient.get(url, requestOptions);
    data.subscribe(data => {
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
        });
        this.isNoUser = false;
      }
      else {
        console.log(data.message);
        this.isNoUser = true;
      }
    });

    return true;
  }

  public GetListTicketApproval() {
    console.log("Log : Run Api getListTicketApproval...");
    this.approvalTicketDataList = [];
    this.approvalTicketDataExtendList = [];

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/getListTicketApproval';

    var data: any = this.httpClient.get(url, requestOptions);
    data.subscribe(data => {
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

          var diffDays = this.GetDiffDays(ticketData);

          var ticketDataExtend: TicketDataExtend = { ticketData: ticketData, sisaHari: diffDays };
          this.approvalTicketDataExtendList.push(ticketDataExtend);
          this.approvalTicketDataList.push(ticketData);
        });
        this.isNoTicket = false;
      }
      else {
        console.log(data.message);
        this.isNoTicket = true;
      }
    });

    return true;
  }

  public GetListTicketData() {
    console.log("Log : Run Api getListTicketData...");
    this.ticketDataList = [];

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/getListTicketData';

    var data: any = this.httpClient.get(url, requestOptions);
    data.subscribe(data => {
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

          this.ticketDataList.push(ticketData);
        });
      }
      else {
        console.log(data.message);
      }
    });

    return true;
  }

  public GetTicketDataListByUser(): Observable<any> {
    let postdata = new FormData();
    postdata.append('trx_ticket_user_id', this.userData.md_user_id);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    // var url = 'http://sihk.hutamakarya.com/apippid/getTicketDataListByUser.php';
    var url = 'http://kipdev.hutamakarya.com/api/getTicketDataListByUser';

    return this.httpClient.post(url, postdata, requestOptions);
  }

  public GetAcuanTicketData(approvalTicketData: TicketData) {
    console.log("Log : Run Api getTicketDataById berhasil");
    this.acuanTicketData = new TicketData();
    let postdata = new FormData();
    postdata.append('trx_ticket_id', approvalTicketData.trx_ticket_reference_id);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/getTicketDataById';

    var data = this.httpClient.post(url, postdata, requestOptions);
    data.subscribe((data: any) => {
      if (data.isSuccess) {
        console.log("Log : Run Api getTicketDataById berhasil");
        var ticketeDataFromDb = data.data;

        this.acuanTicketData.trx_ticket_id = ticketeDataFromDb.trx_ticket_id.toString();
        this.acuanTicketData.trx_ticket_user_id = ticketeDataFromDb.trx_ticket_user_id.toString();
        this.acuanTicketData.trx_ticket_date_created = ticketeDataFromDb.trx_ticket_date_created ? ticketeDataFromDb.trx_ticket_date_created.split(' ')[0] : "-";
        this.acuanTicketData.trx_ticket_date_respond = ticketeDataFromDb.trx_ticket_date_respond ? ticketeDataFromDb.trx_ticket_date_respond.split(' ')[0] : "-";
        this.acuanTicketData.trx_ticket_date_closed = ticketeDataFromDb.trx_ticket_date_closed ? ticketeDataFromDb.trx_ticket_date_closed.split(' ')[0] : "-";
        this.acuanTicketData.trx_ticket_tipe = ticketeDataFromDb.trx_ticket_tipe;
        this.acuanTicketData.trx_ticket_reference_id = ticketeDataFromDb.trx_ticket_reference_id ? ticketeDataFromDb.trx_ticket_reference_id.toString() : null;
        this.acuanTicketData.trx_ticket_tujuan_alasan = ticketeDataFromDb.trx_ticket_tujuan_alasan;
        this.acuanTicketData.trx_ticket_jenis = ticketeDataFromDb.trx_ticket_jenis;
        this.acuanTicketData.trx_ticket_rincian = ticketeDataFromDb.trx_ticket_rincian;
        this.acuanTicketData.trx_ticket_cara = ticketeDataFromDb.trx_ticket_cara;
        this.acuanTicketData.trx_ticket_lampiran = ticketeDataFromDb.trx_ticket_lampiran;
        this.acuanTicketData.trx_ticket_replyadmin = ticketeDataFromDb.trx_ticket_replyadmin;
        this.acuanTicketData.trx_ticket_rating = ticketeDataFromDb.trx_ticket_rating;
        this.acuanTicketData.trx_ticket_status = this.CapitalizeEachWord(ticketeDataFromDb.trx_ticket_status);
      }
      else {
        this.PresentToast(data.message);
        console.log(data.message);
      }
    });
  }

  public GetDiffDays(ticketData: TicketData) {
    var dateTicket = new Date(ticketData.trx_ticket_date_created);
    var dueDate = new Date(dateTicket.getTime() + (1000 * 60 * 60 * 24 * 10));
    var dateNow = new Date();

    // var diff = Math.abs(dueDate.getTime() - dateNow.getTime()); // KALO MISAL PENGEN HASIL PASTI POSITIP
    var diff = dueDate.getTime() - dateNow.getTime();
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return diffDays;
  }

  public CancelTicket(ticketData: TicketData): Observable<any> {
    let postdata = new FormData();
    postdata.append('trx_ticket_id', ticketData.trx_ticket_id);
    postdata.append('trx_ticket_user_id', ticketData.trx_ticket_user_id);
    postdata.append('trx_ticket_replyadmin', "Dibatalkan Secara Pribadi Oleh Pembuat Tiket");
    postdata.append('trx_ticket_status', this.statusTransaksiData.DIBATALKAN);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    // var url = 'http://sihk.hutamakarya.com/apippid/cancelPermohonan.php';
    var url = 'http://kipdev.hutamakarya.com/api/cancelPermohonan';

    return this.httpClient.post(url, postdata, requestOptions);
  }

  public StartProcessTicket(ticketData: TicketData): Observable<any> {
    let postdata = new FormData();
    postdata.append('trx_ticket_id', ticketData.trx_ticket_id);
    postdata.append('trx_ticket_user_id', ticketData.trx_ticket_user_id);
    postdata.append('trx_ticket_status', this.statusTransaksiData.INPROGRESS);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/startProcessTicket';

    return this.httpClient.post(url, postdata, requestOptions);
  }

  public async FinishOrRejectTicket(ticketData: TicketData, approvalId: number, modalController: ModalController, replyAdmin?) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('trx_ticket_id', ticketData.trx_ticket_id);
    postdata.append('trx_ticket_user_id', ticketData.trx_ticket_user_id);
    postdata.append('trx_ticket_status', approvalId == 0 ? this.statusTransaksiData.CLOSE : this.statusTransaksiData.DITOLAK);
    postdata.append('trx_ticket_replyadmin', replyAdmin);

    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.userData.md_user_token,
      }),
    };

    var url = 'http://kipdev.hutamakarya.com/api/finishOrRejectTicket';

    this.http.post(url, postdata, requestOptions).subscribe(
      async (data: any) => {
        await loading.dismiss();
        if (data.isSuccess) {
          this.PresentToast(approvalId == 0 ? "Berhasil Menyelesaikan Tiket" : "Berhasil Melakukan Penolakan Tiket");
          modalController.dismiss(
            { dataPassing: "SUCCESSAPPROVEORREJECTTICKET" },
            'confirm'
          );
        }
        else {
          this.PresentToast(data.message);
          modalController.dismiss(
            { dataPassing: "GAGALTICKET" },
            'confirm'
          );
        }
      }, async (err) => {
        await loading.dismiss();
        this.PresentToast("BUG: " + err?.message);
        modalController.dismiss(
          { dataPassing: "JUSTCANCEL" },
          'backdrop'
        );
      }
    )
  }

  public async GetUserDataFromStorage(): Promise<Boolean> {
    // this.token = await Storage.get({ key: TOKEN_KEY });

    var userData = new UserData();
    userData.md_user_token = (await Storage.get({ key: 'md_user_token' })).value;
    userData.md_user_id = (await Storage.get({ key: 'md_user_id' })).value;
    userData.md_user_name = (await Storage.get({ key: 'md_user_name' })).value;
    userData.md_user_email = (await Storage.get({ key: 'md_user_email' })).value;
    userData.md_user_email_verified_at = (await Storage.get({ key: 'md_user_email_verified_at' })).value;
    userData.md_user_telp = (await Storage.get({ key: 'md_user_telp' })).value;
    userData.md_user_ktp = (await Storage.get({ key: 'md_user_ktp' })).value;
    userData.md_user_npwp = (await Storage.get({ key: 'md_user_npwp' })).value;
    userData.md_user_pekerjaan_id = (await Storage.get({ key: 'md_user_pekerjaan_id' })).value;
    userData.md_user_address = (await Storage.get({ key: 'md_user_address' })).value;
    userData.md_user_instution = (await Storage.get({ key: 'md_user_instution' })).value;
    userData.md_user_password = (await Storage.get({ key: 'md_user_password' })).value;
    userData.md_user_admin = (await Storage.get({ key: 'md_user_admin' })).value;
    userData.md_user_status = (await Storage.get({ key: 'md_user_status' })).value;
    userData.md_user_date_created = (await Storage.get({ key: 'md_user_date_created' })).value;
    userData.md_user_date_modified = (await Storage.get({ key: 'md_user_date_modified' })).value;
    userData.md_user_last_login = (await Storage.get({ key: 'md_user_last_login' })).value;
    this.userData = userData;

    return true;
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

  async PresentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "dark",
      mode: "ios"
    });
    toast.present();
  }

  PresentAlert(msg: string) {
    this.alertController.create({
      mode: 'ios',
      message: msg,
      buttons: ['OK']
    }).then(alert => {
      return alert.present();
    });
  }

  /////////////////////////////// GAK KEPAKAI ///////////////////////////////

  //#region API Photo Service Devdactic https://devdactic.com/ionic-nest-image-upload-capacitor/ dan https://devdactic.com/ionic-nest-image-upload-api/
  getImages() {
    return this.http.get<ApiImage[]>(`${this.urlDEVDACTIC}/image`);
  }

  uploadImage(blobData, name, ext) {
    const formData = new FormData();
    formData.append('file', blobData, `myimage.${ext}`);
    formData.append('name', name);

    return this.http.post(`${this.urlDEVDACTIC}/image`, formData);
  }

  uploadImageFile(file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('file', file, `myimage.${ext}`);
    formData.append('name', file.name);

    return this.http.post(`${this.urlDEVDACTIC}/image`, formData);
  }

  deleteImage(id) {
    return this.http.delete(`${this.urlDEVDACTIC}/image/${id}`);
  }
  //#endregion

  /////////////////////////////// GAK KEPAKAI ///////////////////////////////
}

export class DateData {
  public date: Date;
  public szDay: string;
  public decDate: number;
  public szMonth: string;
  public decYear: number;
  public decHour: number;
  public szHour: string;
  public decMinute: number;
  public szMinute: string;
  public szAMPM: string;
  public decSec: number;
  public decMonth: number;

  constructor() { }
}

export interface ApiImage {
  _id: string;
  name: string;
  createdAt: Date;
  url: string;
}

export class IndexPage {
  public readonly profilPPID: string = "profilPPID";
  public readonly regulasiPPID: string = "regulasiPPID";
  public readonly infBerkala: string = "infBerkala";
  public readonly infSertaMerta: string = "infSertaMerta";
  public readonly infTerSetiapSaat: string = "infTerSetiapSaat";
  public readonly laporanLayanan: string = "laporanLayanan";
  public readonly DwnFormulir: string = "DwnFormulir";
  public readonly PermohonanInformasi: string = "PermohonanInformasi";
  public readonly PengajuanKeberatan: string = "PengajuanKeberatan";
}

export class UserData {
  public md_user_token: string;
  public md_user_id: string;
  public md_user_name: string;
  public md_user_email: string;
  public md_user_email_verified_at: string;
  public md_user_telp: string;
  public md_user_ktp: string;
  public md_user_ktp_data: string;
  public md_user_npwp: string;
  public md_user_pekerjaan_id: string;
  public md_user_address: string;
  public md_user_instution: string;
  public md_user_password: string;
  public md_user_admin: string;
  public md_user_status: string;
  public md_user_date_created: string;
  public md_user_date_modified: string;
  public md_user_last_login: string;
  public pekerjaanData: PekerjaanData = new PekerjaanData();

  constructor() { }
}

export class TicketData {
  public trx_ticket_id: string;
  public trx_ticket_user_id: string;
  public trx_ticket_date_created: string;
  public trx_ticket_date_respond: string;
  public trx_ticket_date_closed: string;
  public trx_ticket_tipe: string;
  public trx_ticket_reference_id: string;
  public trx_ticket_tujuan_alasan: string;
  public trx_ticket_jenis: string;
  public trx_ticket_rincian: string;
  public trx_ticket_cara: string;
  public trx_ticket_lampiran: string;
  public trx_ticket_replyadmin: string;
  public trx_ticket_rating: string;
  public trx_ticket_status: string;
  public trx_ticket_user_data: UserData = new UserData();

  constructor() { }
}

export interface TicketDataExtend extends Record<string, any> {
  ticketData: TicketData;
}

export class AcuanTicketData {
  public trx_ticket_acuan_id: string;
  public trx_ticket_acuan_user_id: string;
  public trx_ticket_acuan_date_created: string;
  public trx_ticket_acuan_date_respond: string;
  public trx_ticket_acuan_date_closed: string;
  public trx_ticket_acuan_tipe: string;
  public trx_ticket_acuan_reference_id: string;
  public trx_ticket_acuan_tujuan_alasan: string;
  public trx_ticket_acuan_jenis: string;
  public trx_ticket_acuan_rincian: string;
  public trx_ticket_acuan_cara: string;
  public trx_ticket_acuan_lampiran: string;
  public trx_ticket_acuan_replyadmin: string;
  public trx_ticket_acuan_rating: string;
  public trx_ticket_acuan_status: string;

  constructor() { }
}

export class StatusUserData {
  // public readonly ACTIVE: string = "ACTIVE";
  // public readonly NOTACTIVE: string = "NOT ACTIVE";
  public readonly KYCREQUIRED: string = "KYC REQUIRED";
  public readonly KYCWAITINGAPPROVAL: string = "KYC WAITING APPROVAL";
  public readonly KYCVERIFIED: string = "KYC VERIFIED";
  public readonly KYCREJECTED: string = "KYC REJECTED";
}

export class StatusTransaksiData {
  public readonly OPEN: string = "Belum Diproses";
  public readonly CLOSE: string = "Selesai";
  public readonly INPROGRESS: string = "Sedang Diproses";
  public readonly DIBATALKAN: string = "Dibatalkan";
  public readonly DITOLAK: string = "Ditolak";
}

export class TicketTypeData {
  public readonly PERMOHONANINFORMASI: string = "Permohonan Informasi";
  public readonly PENGAJUANKEBERATAN: string = "Pengajuan Keberatan";
}

export class OptionRejectUserApprovalData {
  public readonly 0: string = "Identitas tidak sesuai lampiran";
  public readonly 1: string = "Foto lampiran kurang jelas";
  public readonly 2: string = "Institusi tidak terdaftar";
}

export class OptionRejectTicketPermohonanData {
  public readonly 0: string = "File Pendukung (Surat Pengantar Kampus/LSM) tidak sesuai lampiran";
  public readonly 1: string = "Informasi yang diminta bukan Informasi Publik";
  public readonly 2: string = "Informasi yang diminta merupakan Informasi yang dikecualikan";
}

export class PekerjaanData {
  public md_pekerjaan_id: any;
  public md_pekerjaan_name: any;
}
