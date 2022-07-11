import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { IonSlides } from '@ionic/angular';
import { WELCOME_KEY } from 'src/app/guards/welcome.guard';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild(IonSlides)slides: IonSlides;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  async start() {
    await Storage.set({key: WELCOME_KEY, value: 'true'});
    this.router.navigateByUrl('/login', { replaceUrl:true });
  }
}
