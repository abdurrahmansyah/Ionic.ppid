import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';

import { Storage } from '@capacitor/storage';


const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      console.log('auth token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login() {
    return from(Storage.set({ key: TOKEN_KEY, value: 'token' }).then(() => {
      this.isAuthenticated.next(true);
    }));
  }

  // login(credentials: { email, password }): Observable<any> {
  //   console.log(credentials);

  //   let postdata = new FormData();
  //   postdata.append('md_user_email', credentials.email);
  //   postdata.append('md_user_password', credentials.password);

  //   var url = 'http://sihk.hutamakarya.com/apippid/loginppid.php';

  //   return this.http.post(url, postdata);
  //   // .pipe(
  //   //   map((data: any) =>
  //   //     data.data.token
  //   //   ),
  //   //   switchMap(token => {
  //   //     console.log(token);
  //   //     return from(Storage.set({ key: TOKEN_KEY, value: token }));
  //   //   }),
  //   //   tap(_ => {
  //   //     this.isAuthenticated.next(true);
  //   //   })
  //   // )
  // }

  // login(credentials: {email, password}): Observable<any> {
  //   console.log("credentials");
  //   console.log(credentials);

  //   let postdata = new FormData();
  //   // postdata.append('username', credentials.email);
  //   // postdata.append('password', credentials.password);
  //   postdata.append('md_user_email', credentials.email);
  //   postdata.append('md_user_password', credentials.password);
  //   console.log("postdata");
  //   console.log(postdata);

  //   var url = 'https://absensi.hutamakarya.com/api/login';
  //   var url2 = 'https://reqres.in/api/login';
  //   var url3 = 'https://absensi.hutamakarya.com/api/loginSSO';
  //   var url4 = 'http://sihk.hutamakarya.com/apippid/loginppid.php';

  //   return this.http.post(url4, postdata).pipe(
  //     map((data: any) => 
  //     data.data.token
  //     ),
  //     switchMap(token => {
  //       console.log(token);
  //       return from(Storage.set({key: TOKEN_KEY, value: token}));
  //     }),
  //     tap(_ => {
  //       this.isAuthenticated.next(true);
  //     })
  //   )
  // }

  // login(credentials: {email, password}): Observable<any> {
  //   return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
  //     map((data: any) => data.token),
  //     switchMap(token => {
  //       console.log("token" + token);
  //       return from(Storage.set({key: TOKEN_KEY, value: token}));
  //     }),
  //     tap(_ => {
  //       this.isAuthenticated.next(true);
  //     })
  //   )
  // }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}