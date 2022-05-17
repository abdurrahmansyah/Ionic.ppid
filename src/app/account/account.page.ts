import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  values = this.globalService.pekerjaanDataList;
  isUserDataRequired: boolean = false;
  isUserDataNeedApproval: boolean = false;
  isUserDataVerified: boolean = false;
  isModeEdit: boolean = false;
  txtButton: string = 'Edit Account';

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
  ) {
    this.InitializeData();
  }

  async InitializeData() {
    await this.globalService.GetUserDataFromStorage();
  }

  ngOnInit() {
    console.log(this.globalService.userData.md_user_status);

    // this.statusColor = this.gl.trx_ticket_status == this.globalService.statusTransaksiData.OPEN ? "orangered" :
    //   this.ticketData.trx_ticket_status == this.globalService.statusTransaksiData.INPROGRESS ? "yellow" :
    //     this.ticketData.trx_ticket_status == this.globalService.statusTransaksiData.CLOSE ? "green" : "black";

    this.isUserDataRequired = this.globalService.userData.md_user_status == this.globalService.statusUserData.KYCREQUIRED;
    this.isUserDataNeedApproval = this.globalService.userData.md_user_status == this.globalService.statusUserData.KYCNEEDAPPROVAL;
    this.isUserDataVerified = this.globalService.userData.md_user_status == this.globalService.statusUserData.KYCVERIFIED;
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

  public UpdateAccount() {
    if (this.globalService.userData.md_user_status != this.globalService.statusUserData.KYCVERIFIED) {
      if (this.isModeEdit) {
        if (this.credentials.valid) {
          // this.globalService.UpdateAccount(this.credentials.value);
  
          this.credentials.controls['telp'].disable();
          this.credentials.controls['ktp'].disable();
          this.credentials.controls['npwp'].disable();
          this.credentials.controls['pekerjaan'].disable();
          this.credentials.controls['alamat'].disable();
          this.credentials.controls['institusi'].disable();
  
          this.isModeEdit = false;
          this.txtButton = 'Edit Account';
        }
      } else {
        this.credentials.controls['telp'].enable();
        this.credentials.controls['ktp'].enable();
        this.credentials.controls['npwp'].enable();
        this.credentials.controls['pekerjaan'].enable();
        this.credentials.controls['alamat'].enable();
        this.credentials.controls['institusi'].enable();
  
        this.isModeEdit = true;
        this.txtButton = 'Confirm Update';
      }
    } else {
      this.globalService.PresentAlert("Akun sudah terverifikasi, tidak dapat diedit");
    }
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
}
