import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ModalOptions, ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InjectorInstance } from '../app.module';
import { TicketComponent } from '../components/ticket/ticket.component';
import { OtpComponent } from '../components/otp/otp.component';

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
  public isSeenAlertPPID: boolean = false;
  urlDEVDACTIC = 'http://localhost:3000';

  httpClient = InjectorInstance.get<HttpClient>(HttpClient);
  public pekerjaanDataList = [];
  public approvalUserDataList = [];

  constructor(private authService: AuthenticationService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router,
    private http: HttpClient,
    private modalController: ModalController) {
    this.IndexPageData = new IndexPage();
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
        console.log(data);

        if (data.result) {
          await loading.dismiss();

          if (data.data.md_user_email_verified_at) {
            await this.MappingUserData(data);

            this.authService.login(data.token);
            this.PresentToast("Login Berhasil");
            this.router.navigate(['tabs']);
          } else {

            // ///////////////////////////////////////////////// tes mau nambahin component otp
            // const modal = await this.modalController.create({
            //   component: TicketComponent,
            //   initialBreakpoint: 0.6,
            //   breakpoints: [0, 0.6, 0.95],
            //   mode: 'md',
            //   componentProps: {
            //     'ticketData': "ticketData"
            //   }
            // });
            // // modal.present();
            // modal.onDidDismiss().then((modelData) => {
            //   if (modelData.role == "confirm") {
            //     if (modelData.data.dataPassing == "CANCELTICKET") {
            //       console.log("harusnya jalanin GetTicketDataListByUser lagi");

            //       this.GetTicketDataListByUser();
            //     }
            //   }
            // })

            // return await modal.present();

            // /////////////////////////////////////////////////

            // this.PresentToast("Login Berhasil");
            // this.router.navigate(['tabs']);

            /////////////////////////////////////////////////

            const options: ModalOptions = {
              component: OtpComponent,
              initialBreakpoint: 0.95,
              breakpoints: [0, 0.95],
              mode: 'md',
              componentProps: {
                email: credentials.email
              },
              swipeToClose: true
            };
            const modal = this.modalController.create(options);
            (await modal).present();
            const data: any = (await modal).onWillDismiss();

          }
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.message);
        }
      }
    );
  }

  private async MappingUserData(data: any) {
    var userDataFromDb = data.data;

    await Storage.set({ key: 'md_user_token', value: data.token });
    await Storage.set({ key: 'md_user_id', value: userDataFromDb.id });
    await Storage.set({ key: 'md_user_name', value: userDataFromDb.md_user_name });
    await Storage.set({ key: 'md_user_email', value: userDataFromDb.md_user_email });
    await Storage.set({ key: 'md_user_telp', value: userDataFromDb.md_user_telp });
    await Storage.set({ key: 'md_user_ktp', value: userDataFromDb.md_user_ktp });
    await Storage.set({ key: 'md_user_npwp', value: userDataFromDb.md_user_npwp });
    await Storage.set({ key: 'md_user_pekerjaan_id', value: userDataFromDb.md_user_pekerjaan_id == null ? "" : userDataFromDb.md_user_pekerjaan_id });
    await Storage.set({ key: 'md_user_address', value: userDataFromDb.md_user_address });
    await Storage.set({ key: 'md_user_instution', value: userDataFromDb.md_user_instution });
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
        if (data.result) {

          await loading.dismiss();
          this.PresentToast(data.message);

          let navigationExtras: NavigationExtras = {
            state: {
              emailLog: credentials.email
            }
          }
          this.router.navigate(['login'], navigationExtras);
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.message);
        }
      }, (error: any) => {
        this.loadingController.dismiss();
        var error_msg = error.error.md_user_email[0] ? "Gagal! Email Sudah Terdaftar" :
          error.error.md_user_email[0] ? "Email Tidak Boleh Kosong" :
            error.error.password[0] ? "Password Tidak Boleh Kosong" :
              error.error.md_user_telp[0] ? "No HP Tidak Boleh Kosong" :
                error.error.md_user_admin[0] ? "Status Admin Tidak Boleh Kosong" :
                  error.error.md_user_status[0] ? "Status Tidak Boleh Kosong" : "BUG: Gagal Register";
        console.log(error_msg);

        this.PresentToast(error_msg);
      }
    );
  }

  public async UpdateAccount(credentials: { telp, ktp, npwp, pekerjaan, alamat, institusi }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_email', this.userData.md_user_email);
    postdata.append('md_user_password', this.userData.md_user_password);
    postdata.append('md_user_telp', credentials.telp);
    postdata.append('md_user_ktp', credentials.ktp);
    postdata.append('md_user_npwp', credentials.npwp);
    postdata.append('md_user_pekerjaan_id', credentials.pekerjaan);
    postdata.append('md_user_address', credentials.alamat);
    postdata.append('md_user_instution', credentials.institusi);
    postdata.append('md_user_admin', this.userData.md_user_admin);
    postdata.append('md_user_status', this.statusUserData.KYCWAITINGAPPROVAL);

    var url = 'http://sihk.hutamakarya.com/apippid/updateAccount.php';

    this.http.post(url, postdata).subscribe(
      async (data: any) => {
        console.log(data);
        if (!data.error) {

          await Storage.set({ key: 'md_user_id', value: data.result[0] });
          await Storage.set({ key: 'md_user_name', value: data.result[1] });
          await Storage.set({ key: 'md_user_email', value: data.result[2] });
          await Storage.set({ key: 'md_user_telp', value: data.result[3] });
          await Storage.set({ key: 'md_user_ktp', value: data.result[4] });
          await Storage.set({ key: 'md_user_npwp', value: data.result[5] });
          await Storage.set({ key: 'md_user_pekerjaan_id', value: data.result[6] == null ? "" : data.result[6] });
          await Storage.set({ key: 'md_user_address', value: data.result[7] });
          await Storage.set({ key: 'md_user_instution', value: data.result[8] });
          await Storage.set({ key: 'md_user_password', value: data.result[9] });
          await Storage.set({ key: 'md_user_admin', value: data.result[10] });
          await Storage.set({ key: 'md_user_status', value: data.result[11] });
          await Storage.set({ key: 'md_user_date_created', value: data.result[12] });
          await Storage.set({ key: 'md_user_date_modified', value: data.result[13] });
          await Storage.set({ key: 'md_user_last_login', value: data.result[14] });

          await loading.dismiss();
          await this.GetUserDataFromStorage();
          this.PresentToast("Update Akun Berhasil");
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.error_msg);
        }
      }
    );
  }

  public async CreatePermohonanInformasi(credentials: { tujuan, rincian, cara, lampiran }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('trx_ticket_user_id', this.userData.md_user_id);
    postdata.append('trx_ticket_tipe', this.ticketTypeData.PERMOHONANINFORMASI);
    postdata.append('trx_ticket_tujuan_alasan', credentials.tujuan);
    postdata.append('trx_ticket_rincian', credentials.rincian);
    postdata.append('trx_ticket_cara', credentials.cara);
    postdata.append('trx_ticket_lampiran', credentials.lampiran);
    postdata.append('trx_ticket_status', this.statusTransaksiData.OPEN);

    var url = 'http://sihk.hutamakarya.com/apippid/createPermohonan.php';

    this.http.post(url, postdata).subscribe(
      async (data: any) => {
        if (!data.error) {

          await loading.dismiss();
          this.PresentToast("Permohonan Informasi Berhasil");
          this.router.navigate(['tabs']);
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.error_msg);
        }
      }
    );
  }

  public GetListPekerjaan() {
    let postdata = new FormData();

    var url = 'http://sihk.hutamakarya.com/apippid/getListPekerjaan.php';

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      data.result.forEach(pekerjaanDataFromDb => {
        var pekerjaanData = new PekerjaanData();

        pekerjaanData.md_pekerjaan_id = pekerjaanDataFromDb.md_pekerjaan_id;
        pekerjaanData.md_pekerjaan_name = pekerjaanDataFromDb.md_pekerjaan_name;
        this.pekerjaanDataList.push(pekerjaanData);
      });
    });
  }

  public GetListUserApproval() {
    let postdata = new FormData();

    var url = 'http://sihk.hutamakarya.com/apippid/getListUserApproval.php';

    var data: any = this.httpClient.post(url, postdata);
    data.subscribe(data => {
      data.result.forEach(approvalUserDataFromDb => {
        var userData = new UserData();

        userData.md_user_id = approvalUserDataFromDb.md_user_id;
        userData.md_user_name = approvalUserDataFromDb.md_user_name;
        userData.md_user_email = approvalUserDataFromDb.md_user_email;
        userData.md_user_telp = approvalUserDataFromDb.md_user_telp;
        userData.md_user_ktp = approvalUserDataFromDb.md_user_ktp;
        userData.md_user_npwp = approvalUserDataFromDb.md_user_npwp;
        userData.md_user_pekerjaan_id = approvalUserDataFromDb.md_user_pekerjaan_id;
        userData.md_user_address = approvalUserDataFromDb.md_user_address;
        userData.md_user_instution = approvalUserDataFromDb.md_user_instution;
        userData.md_user_password = approvalUserDataFromDb.md_user_password;
        userData.md_user_admin = approvalUserDataFromDb.md_user_admin;
        userData.md_user_status = approvalUserDataFromDb.md_user_status;
        userData.md_user_date_created = approvalUserDataFromDb.md_user_date_created;
        userData.md_user_date_modified = approvalUserDataFromDb.md_user_date_modified;
        userData.md_user_last_login = approvalUserDataFromDb.md_user_last_login;

        this.approvalUserDataList.push(userData);
      });
    });
  }

  public GetTicketDataListByUser(): Observable<any> {
    let postdata = new FormData();
    postdata.append('trx_ticket_user_id', this.userData.md_user_id);

    var url = 'http://sihk.hutamakarya.com/apippid/getTicketDataListByUser.php';

    return this.httpClient.post(url, postdata);
  }

  public CancelTicket(ticketData: TicketData): Observable<any> {
    let postdata = new FormData();
    postdata.append('trx_ticket_id', ticketData.trx_ticket_id);
    postdata.append('trx_ticket_user_id', ticketData.trx_ticket_user_id);
    postdata.append('trx_ticket_replyadmin', "SELF CANCEL BY USER AUTHORIZED");
    postdata.append('trx_ticket_status', this.statusTransaksiData.CLOSE);

    var url = 'http://sihk.hutamakarya.com/apippid/cancelPermohonan.php';

    return this.httpClient.post(url, postdata);
  }

  // public async GetTicketDataListByUser() {
  //   const loading = await this.loadingController.create();
  //   await loading.present();

  //   let postdata = new FormData();
  //   postdata.append('trx_ticket_user_id', this.userData.md_user_id);

  //   var url = 'http://sihk.hutamakarya.com/apippid/getTicketDataListByUser.php';

  //   return this.httpClient.post(url, postdata);
  //   // this.http.post(url, postdata).subscribe(
  //   //   async (data: any) => {
  //   //     if (!data.error) {
  //   //       console.log(data.result);

  //   //       await loading.dismiss();
  //   //       // this.router.navigate(['tabs']);
  //   //     }
  //   //     else {
  //   //       this.loadingController.dismiss();
  //   //       this.PresentToast(data.error_msg);
  //   //     }
  //   //   }
  //   // );
  // }

  public async GetUserDataFromStorage() {
    // this.token = await Storage.get({ key: TOKEN_KEY });

    var userData = new UserData();
    userData.md_user_token = (await Storage.get({ key: 'md_user_token' })).value;
    userData.md_user_id = (await Storage.get({ key: 'md_user_id' })).value;
    userData.md_user_name = (await Storage.get({ key: 'md_user_name' })).value;
    userData.md_user_email = (await Storage.get({ key: 'md_user_email' })).value;
    userData.md_user_telp = (await Storage.get({ key: 'md_user_telp' })).value;
    userData.md_user_ktp = (await Storage.get({ key: 'md_user_ktp' })).value ? "" : (await Storage.get({ key: 'md_user_ktp' })).value;
    userData.md_user_npwp = (await Storage.get({ key: 'md_user_npwp' })).value ? "" : (await Storage.get({ key: 'md_user_npwp' })).value;
    userData.md_user_pekerjaan_id = (await Storage.get({ key: 'md_user_pekerjaan_id' })).value;
    userData.md_user_address = (await Storage.get({ key: 'md_user_address' })).value ? "" : (await Storage.get({ key: 'md_user_address' })).value;
    userData.md_user_instution = (await Storage.get({ key: 'md_user_instution' })).value ? "" : (await Storage.get({ key: 'md_user_instution' })).value;
    userData.md_user_password = (await Storage.get({ key: 'md_user_password' })).value;
    userData.md_user_admin = (await Storage.get({ key: 'md_user_admin' })).value;
    userData.md_user_status = (await Storage.get({ key: 'md_user_status' })).value;
    userData.md_user_date_created = (await Storage.get({ key: 'md_user_date_created' })).value;
    userData.md_user_date_modified = (await Storage.get({ key: 'md_user_date_modified' })).value;
    userData.md_user_last_login = (await Storage.get({ key: 'md_user_last_login' })).value;
    this.userData = userData;
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

  // -------------------------------------------------------------------------------------------

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
  public md_user_telp: string;
  public md_user_ktp: string;
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
  public trx_ticket_rincian: string;
  public trx_ticket_cara: string;
  public trx_ticket_lampiran: string;
  public trx_ticket_replyadmin: string;
  public trx_ticket_rating: string;
  public trx_ticket_status: string;

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
  public readonly OPEN: string = "OPEN";
  public readonly CLOSE: string = "CLOSE";
  public readonly INPROGRESS: string = "IN PROGRESS";
}

export class TicketTypeData {
  public readonly PERMOHONANINFORMASI: string = "Permohonan Informasi";
  public readonly PENGAJUANKEBERATAN: string = "Pengajuan Keberatan";
}

export class PekerjaanData {
  public md_pekerjaan_id: any;
  public md_pekerjaan_name: any;
}
