import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { GlobalService, UserData } from 'src/app/services/global.service';
const TOKEN_KEY = 'my-token';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    public activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.GetExtras();
  }

  private GetExtras(){
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        console.log("extras: " + this.router.getCurrentNavigation().extras.state.emailLog);
        
        this.credentials = this.fb.group({
          email: [this.router.getCurrentNavigation().extras.state.emailLog, [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(5)]],
        });
      }
    });
  }

  async Login() {
    this.globalService.Login(this.credentials.value);
  }

  public Register() {
    let navigationExtras: NavigationExtras = {
      state: {
        emailLog: this.credentials.value.email
      }
    }
    this.router.navigate(['register'], navigationExtras);

    // this.router.navigateByUrl('/register', { replaceUrl: false });
  }

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
}