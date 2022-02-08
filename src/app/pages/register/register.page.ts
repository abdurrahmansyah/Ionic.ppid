import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;
  iconName: string = 'eye';
  passwordType: string = 'password';
  passwordShown: boolean = false;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    public activatedRoute: ActivatedRoute
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
        console.log("extras: " + this.router.getCurrentNavigation().extras.state.emailLog);

        this.credentials = this.fb.group({
          name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
          email: [this.router.getCurrentNavigation().extras.state.emailLog, [Validators.required, Validators.email]],
          telp: ['', [Validators.required, Validators.pattern('[0-9]*')]],
          password: ['', [Validators.required, Validators.minLength(5)]],
        });
      }
    });
  }

  async Register() {
    this.globalService.Register(this.credentials.value);
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
