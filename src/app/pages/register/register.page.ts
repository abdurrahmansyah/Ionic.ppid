import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFirebaseService } from 'src/app/services/auth-firebase.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;
  passwordIconName: string = 'eye';
  confirmPasswordIconName: string = 'eye';
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';
  passwordShown: boolean = false;
  confirmPasswordShown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private authFirebaseService: AuthFirebaseService
  ) { }

  ngOnInit() {
    // this.credentials = this.fb.group({
    //   name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    //   email: ['', [Validators.required, Validators.email]],
    //   telp: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    //   password: ['', [Validators.required, Validators.minLength(5)]],
    // });

    this.GetExtras();
  }

  private GetExtras() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.credentials = this.fb.group({
          name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          email: [this.router.getCurrentNavigation().extras.state.emailLog, [Validators.required, Validators.email]],
          telp: ['', [Validators.required, Validators.pattern('[0-9]*')]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        });
      }
    });
  }

  async Register() {
    if (this.credentials.value.confirmPassword == this.credentials.value.password)
      this.globalService.Register(this.credentials.value);
    else
      this.globalService.PresentToast("Password Not Match With Confirm Password");
  }

  public Login() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
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

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }

  public togglePass() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
      this.passwordIconName = 'eye';
    } else {
      this.passwordShown = true;
      this.passwordType = '';
      this.passwordIconName = 'eye-off';
    }
  }

  public toggleConfirmPass() {
    if (this.confirmPasswordShown) {
      this.confirmPasswordShown = false;
      this.confirmPasswordType = 'password';
      this.confirmPasswordIconName = 'eye';
    } else {
      this.confirmPasswordShown = true;
      this.confirmPasswordType = '';
      this.confirmPasswordIconName = 'eye-off';
    }
  }
}
