import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { NavigationExtras, Router } from '@angular/router';

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  IndexPageData: IndexPage;
  private token: any;
  public userData: UserData;
  public statusUserData = new StatusUserData;

  constructor(private authService: AuthenticationService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private http: HttpClient) {
    this.IndexPageData = new IndexPage();
  }

  public async Login(credentials: { email, password }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_email', credentials.email);
    postdata.append('md_user_password', credentials.password);

    var url = 'http://sihk.hutamakarya.com/apippid/loginppid.php';

    this.http.post(url, postdata).subscribe(
      async (data: any) => {
        console.log(data);
        
        if (!data.error) {
          // var userDataFromDb = data.result;//.find(x => x);
          // var userData = this.MappingUserData(userDataFromDb);

          await Storage.set({ key: 'md_user_id', value: data.result[0] });
          await Storage.set({ key: 'md_user_name', value: data.result[1] });
          await Storage.set({ key: 'md_user_email', value: data.result[2] });
          await Storage.set({ key: 'md_user_telp', value: data.result[3] });
          await Storage.set({ key: 'md_user_ktp', value: data.result[4] });
          await Storage.set({ key: 'md_user_npwp', value: data.result[5] });
          await Storage.set({ key: 'md_pekerjaan_id', value: data.result[6] });
          await Storage.set({ key: 'md_user_address', value: data.result[7] });
          await Storage.set({ key: 'md_user_instution', value: data.result[8] });
          await Storage.set({ key: 'md_user_password', value: data.result[9] });
          await Storage.set({ key: 'md_user_admin', value: data.result[10] });
          await Storage.set({ key: 'md_user_status', value: data.result[11] });
          await Storage.set({ key: 'md_user_date_created', value: data.result[12] });
          await Storage.set({ key: 'md_user_date_modified', value: data.result[13] });
          await Storage.set({ key: 'md_user_last_login', value: data.result[14] });

          this.authService.login()
          await loading.dismiss();
          this.PresentToast("Login Berhasil");
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.error_msg);
        }
      }
    );
  }

  public async Register(credentials: { name, email, telp, password }) {
    const loading = await this.loadingController.create();
    await loading.present();

    let postdata = new FormData();
    postdata.append('md_user_name', credentials.name);
    postdata.append('md_user_email', credentials.email);
    postdata.append('md_user_telp', credentials.telp);
    postdata.append('md_user_password', credentials.password);
    postdata.append('md_user_admin', 'FALSE');
    postdata.append('md_user_status', this.statusUserData.notActive);

    var url = 'http://sihk.hutamakarya.com/apippid/registerppid.php';

    this.http.post(url, postdata).subscribe(
      async (data: any) => {
        console.log(data);
        if (!data.error) {

          await loading.dismiss();
          this.PresentToast("Register Berhasil");

          let navigationExtras: NavigationExtras = {
            state: {
              emailLog: credentials.email
            }
          }
          this.router.navigate(['login'], navigationExtras);
        }
        else {
          this.loadingController.dismiss();
          this.PresentToast(data.error_msg);
        }
      }
    );
  }

  private MappingUserData(userDataFromDb: any) {
    var userData = new UserData();
    userData.md_user_id = userDataFromDb.md_user_id;
    userData.md_user_name = userDataFromDb.md_user_name;
    userData.md_user_email = userDataFromDb.md_user_email;
    userData.md_user_telp = userDataFromDb.md_user_telp;
    userData.md_user_ktp = userDataFromDb.md_user_ktp;
    userData.md_user_npwp = userDataFromDb.md_user_npwp;
    userData.md_pekerjaan_id = userDataFromDb.md_pekerjaan_id;
    userData.md_user_address = userDataFromDb.md_user_address;
    userData.md_user_instution = userDataFromDb.md_user_instution;
    userData.md_user_password = userDataFromDb.md_user_password;
    userData.md_user_admin = userDataFromDb.md_user_admin;
    userData.md_user_status = userDataFromDb.md_user_status;
    userData.md_user_date_created = userDataFromDb.md_user_date_created;
    userData.md_user_date_modified = userDataFromDb.md_user_date_modified;
    userData.md_user_last_login = userDataFromDb.md_user_last_login;

    return userData;
  }

  public async GetUserDataFromStorage() {
    this.token = await Storage.get({ key: TOKEN_KEY });

    var userData = new UserData();
    userData.md_user_id = (await Storage.get({ key: 'md_user_id' })).value;
    userData.md_user_name = (await Storage.get({ key: 'md_user_name' })).value;
    userData.md_user_email = (await Storage.get({ key: 'md_user_email' })).value;
    userData.md_user_telp = (await Storage.get({ key: 'md_user_telp' })).value;
    userData.md_user_ktp = (await Storage.get({ key: 'md_user_ktp' })).value;
    userData.md_user_npwp = (await Storage.get({ key: 'md_user_npwp' })).value;
    userData.md_pekerjaan_id = (await Storage.get({ key: 'md_pekerjaan_id' })).value;
    userData.md_user_address = (await Storage.get({ key: 'md_user_address' })).value;
    userData.md_user_instution = (await Storage.get({ key: 'md_user_instution' })).value;
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
  public md_user_id: string;
  public md_user_name: string;
  public md_user_email: string;
  public md_user_telp: string;
  public md_user_ktp: string;
  public md_user_npwp: string;
  public md_pekerjaan_id: string;
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

export class StatusUserData {
  public readonly active: string = "ACTIVE";
  public readonly notActive: string = "NOT ACTIVE";
}