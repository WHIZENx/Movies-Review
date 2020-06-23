import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable(
   {providedIn:"root"}
)
export class AuthService {

  public isLoggedIn = new Subject<boolean>();
  private callAuthSource = new Subject<any>();

  callAuth = this.callAuthSource.asObservable();

  login() {
    localStorage.setItem('isLoggedIn', "true");
    this.isLoggedIn.next(true);
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    this.isLoggedIn.next(false);
  }

  refreshAuth() {
    this.callAuthSource.next();
  }

  constructor() { }

}