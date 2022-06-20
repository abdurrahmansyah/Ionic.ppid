import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { GlobalService, UserData } from '../services/global.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  credentials: FormGroup;
  iconName: string = 'eye';
  passwordType: string = 'password';
  passwordShown: boolean = false;
  numberType: string = 'number';
  pekerjaanDataList = this.globalService.pekerjaanDataList;
  isUserDataRequired: boolean = false;
  isUserDataWaitingApproval: boolean = false;
  isUserDataVerified: boolean = false;
  isUserDataRejected: boolean = false;
  isModeEdit: boolean = false;
  txtButton: string = 'Perbarui Akun';

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private alertController: AlertController
  ) {
    this.InitializeData();
  }

  async InitializeData() {
    // await this.globalService.GetUserDataFromStorage();
  }

  ngOnInit() {
    console.log(this.globalService.userData);

    this.SpecifyStatus();
    this.DeclareCredentials();
  }

  private SpecifyStatus() {
    this.isUserDataRequired = this.globalService.userData.md_user_status.split('_')[0] == this.globalService.statusUserData.KYCREQUIRED
      || this.globalService.userData.md_user_status.split('_')[0] == this.globalService.statusUserData.KYCREJECTED;
    this.isUserDataWaitingApproval = this.globalService.userData.md_user_status == this.globalService.statusUserData.KYCWAITINGAPPROVAL;
    this.isUserDataVerified = this.globalService.userData.md_user_status == this.globalService.statusUserData.KYCVERIFIED;
    this.isUserDataRejected = this.globalService.userData.md_user_status.split('_')[0] == this.globalService.statusUserData.KYCREJECTED;
  }

  private DeclareCredentials() {
    this.credentials = this.fb.group({
      name: [{ value: this.globalService.userData.md_user_name, disabled: true }, [Validators.required]],
      email: [{ value: this.globalService.userData.md_user_email, disabled: true }, [Validators.required, Validators.email]],
      telp: [{ value: this.globalService.userData.md_user_telp, disabled: true }, [Validators.required, Validators.pattern('[0-9]*')]],
      // password: ['', [Validators.required, Validators.minLength(5)]],
      ktp: [{ value: this.globalService.userData.md_user_ktp, disabled: true }, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(16), Validators.maxLength(16)]],
      npwp: [{ value: this.globalService.userData.md_user_npwp, disabled: true }, [Validators.pattern('[0-9]*'), Validators.minLength(15), Validators.maxLength(15)]],
      pekerjaan: [{ value: this.globalService.userData.md_user_pekerjaan_id, disabled: true }, [Validators.required]],
      alamat: [{ value: this.globalService.userData.md_user_address, disabled: true }, [Validators.required]],
      institusi: [{ value: this.globalService.userData.md_user_instution, disabled: true }, [Validators.required]],
    });
  }

  get name() {
    return this.credentials.get('name');
  }

  get email() {
    return this.credentials.get('email');
  }

  get telp() {
    return this.credentials.get('telp');
  }

  // get password() {
  //   return this.credentials.get('password');
  // }

  get ktp() {
    return this.credentials.get('ktp');
  }

  get npwp() {
    return this.credentials.get('npwp');
  }

  get pekerjaan() {
    return this.credentials.get('pekerjaan');
  }

  get alamat() {
    return this.credentials.get('alamat');
  }

  get institusi() {
    return this.credentials.get('institusi');
  }

  public togglePass() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
      this.iconName = 'eye';
    } else {
      this.passwordShown = true;
      this.passwordType = '';
      this.iconName = 'eye-off';
    }
  }

  public Help() {
    var txtStatusMessage = this.globalService.userData.md_user_status.split('_')[1];
    txtStatusMessage = txtStatusMessage +  ' Pastikan data diri sesuai dengan data pada identitas';

    this.PresentAlertRejected(txtStatusMessage);
  }

  PresentAlertRejected(msg: string) {
    this.alertController.create({
      mode: 'ios',
      header: 'KYC Rejected',
      message: msg,
      buttons: ['OK']
    }).then(alert => {
      return alert.present();
    });
  }

  DoRefresh(event?: any) {
    this.globalService.GetUserById();
    this.SpecifyStatus();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  public UpdateAccount() {
    if (this.globalService.userData.md_user_status != this.globalService.statusUserData.KYCVERIFIED) {
      if (this.isModeEdit) {
        if (this.credentials.valid) {
          this.globalService.UpdateAccount(this.credentials.value)
          if (this.globalService.isUpdateAccountSuccess) {
            this.DisableCredentialControl();

            this.isModeEdit = false;
            this.txtButton = 'Perbarui Akun';
          } else {
            this.CancelEdit();
          }
        }
      } else {
        this.credentials.controls['telp'].enable();
        this.credentials.controls['ktp'].enable();
        this.credentials.controls['npwp'].enable();
        this.credentials.controls['pekerjaan'].enable();
        this.credentials.controls['alamat'].enable();
        this.credentials.controls['institusi'].enable();

        this.isModeEdit = true;
        this.txtButton = 'Konfirmasi Perubahan';
      }
    } else {
      this.globalService.PresentAlert("Akun sudah terverifikasi, tidak dapat diubah");
    }
  }

  public CancelEdit() {
    this.SyncUserData();
    this.DisableCredentialControl();

    this.isModeEdit = false;
    this.txtButton = 'Perbarui Akun';
  }

  private DisableCredentialControl() {
    this.credentials.controls['telp'].disable();
    this.credentials.controls['ktp'].disable();
    this.credentials.controls['npwp'].disable();
    this.credentials.controls['pekerjaan'].disable();
    this.credentials.controls['alamat'].disable();
    this.credentials.controls['institusi'].disable();
  }

  private SyncUserData() {
    this.credentials.controls['telp'].setValue(this.globalService.userData.md_user_telp);
    this.credentials.controls['ktp'].setValue(this.globalService.userData.md_user_ktp);
    this.credentials.controls['npwp'].setValue(this.globalService.userData.md_user_npwp);
    this.credentials.controls['pekerjaan'].setValue(this.globalService.userData.md_user_pekerjaan_id);
    this.credentials.controls['alamat'].setValue(this.globalService.userData.md_user_address);
    this.credentials.controls['institusi'].setValue(this.globalService.userData.md_user_instution);
  }
}
