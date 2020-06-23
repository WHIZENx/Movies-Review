import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private afAuth : AngularFireAuth,
    private route : Router,
    private fServ : FirebaseService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return Observable.create(obs => {
        this.afAuth.auth.onAuthStateChanged(user => {
          if (user) {
            obs.next(true);
            this.fServ.getUser(user.displayName, 'users').subscribe(val => {
              val.map( e => {
                if (e.payload.doc.data()['status'] == 'Ban') this.route.navigate(['']);
                if (e.payload.doc.data()['level'] == 'Normal' || e.payload.doc.data()['level'] == 'Gold') this.route.navigate(['']);
              });
            });
          }
          else {
            obs.next(false);
            this.route.navigate(['login']);
          }
        });
      });
  }
}
