import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-update-user-data',
  templateUrl: './update-user-data.page.html',
  styleUrls: ['./update-user-data.page.scss'],
})
export class UpdateUserDataPage implements OnInit {
  credentials: FormGroup;
  iconName: string = 'eye';
  passwordType: string = 'password';
  passwordShown: boolean = false;
  numberType: string = 'number';

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      name: [{ value: this.globalService.userData.md_user_name, disabled: true }, [Validators.required]],
      email: [{ value: this.globalService.userData.md_user_email, disabled: true }, [Validators.required, Validators.email]],
      telp: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      ktp: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      npwp: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(15), Validators.maxLength(15)]],
      pekerjaan: ['', [Validators.required]], 
      alamat: ['', [Validators.required]],
      institusi: ['', [Validators.required]],
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

  get password() {
    return this.credentials.get('password');
  }

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
