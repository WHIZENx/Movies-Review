import { Component } from '@angular/core';
import { ThemeService } from './theme.service';
import { LangService } from './lang.service';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from './auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  isDarkTheme;
  str_dark;

  isVip = false;

  constructor(
    private route : Router,
    private lServ: LangService,
    private fServ : FirebaseService,
    private thServ: ThemeService,
    private afAuth : AngularFireAuth,
    private firestore: AngularFirestore,
    private auth : AuthService,
    private _snackbar: MatSnackBar
  ) {
    this.route.events.subscribe((val) => {
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.fServ.getUser(user.displayName, 'users').subscribe( v=> {
            v.map( e => {
              if (e.payload.doc.data()['vip'] && e.payload.doc.data()['expire'] != null) {
                const today = new Date();
                if (today.getTime()>=e.payload.doc.data()['expire'].seconds*1000) {
                  this.vip_expire = true;
                  this.fServ.expireVip(this.username, 'users');
                }
              }
            });
          });
        }
      });
    });
  }

  isLoggedIn;
  username;
  curr_user;
  user_status;

  isLangThai;
  ban_lang;
  contact_lang;

  vip_expire_lang;
  profile_lang;

  text_lang;

  send_lang;
  close_lang;

  vip_expire;

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.ban_lang = "คุณถูกแบน! โปรด";
      this.contact_lang = "ติดต่อเรา";
      this.text_lang = "โปรดกรอกแบบฟอร์ม";
      this.send_lang = "ส่ง";
      this.close_lang = "ปิด";
      this.vip_expire_lang = "VIP ของคุณหมดอายุแล้ว คุณสามารถซื้อได้ที่หน้า ";
      this.profile_lang = "โปรไฟล์";
    } else {
      this.isLangThai = false;
      this.ban_lang = "You have been Banned! Please";
      this.contact_lang = "Contact us";
      this.text_lang = "Please type form";
      this.send_lang = "Send";
      this.close_lang = "Close";
      this.vip_expire_lang = "Your VIP has expired. You can buy it on page ";
      this.profile_lang = "Profile";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.ban_lang = "คุณถูกแบน! โปรด";
        this.contact_lang = "ติดต่อเรา";
        this.text_lang = "โปรดกรอกแบบฟอร์ม";
        this.send_lang = "ส่ง";
        this.close_lang = "ปิด";
        this.vip_expire_lang = "VIP ของคุณหมดอายุแล้ว คุณสามารถซื้อได้ที่หน้า ";
        this.profile_lang = "โปรไฟล์";
      } else {
        this.isLangThai = false;
        this.ban_lang = "You have been Banned! Please";
        this.contact_lang = "Contact us";
        this.text_lang = "Please type form";
        this.send_lang = "Send";
        this.close_lang = "Close";
        this.vip_expire_lang = "Your VIP has expired. You can buy it on page ";
        this.profile_lang = "Profile";
      }
    });
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.displayName;
          this.isLoggedIn = true;
          this.fServ.getUser(user.displayName, 'users').subscribe( v=> {
          this.curr_user = v.map( e => {
            this.user_status = e.payload.doc.data()['status'];
            this.isVip = e.payload.doc.data()['vip'];
            if (this.isVip && e.payload.doc.data()['expire'] != null) {
              const today = new Date();
              if (today.getTime()>=e.payload.doc.data()['expire'].seconds*1000) {
                this.vip_expire = true;
                this.fServ.expireVip(this.username, 'users');
              }
            }
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
              }
            })
          });
        }
      });
    }
    this.auth.callAuth.subscribe(
        () => {
          this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
          if (localStorage.getItem("isLoggedIn")==="true") {
            this.isLoggedIn = true;
            this.afAuth.auth.onAuthStateChanged(user => {
              if (user) {
                this.username = user.displayName;
                this.isLoggedIn = true;
                this.fServ.getUser(user.displayName, 'users').subscribe( v => {
                this.curr_user = v.map( e => {
                  this.user_status = e.payload.doc.data()['status'];
                  this.isVip = e.payload.doc.data()['vip'];
                  if (this.isVip && e.payload.doc.data()['expire'] != null) {
                    const today = new Date();
                    if (today.getTime()>=e.payload.doc.data()['expire'].seconds*1000) {
                      this.vip_expire = true;
                      this.fServ.expireVip(this.username, 'users');
                    }
                  }
                  return {
                    id: e.payload.doc.id,
                    ...e.payload.doc.data()
                    }
                  })
                });
              }
            });
          }
        }
      );
    this.thServ.isDarkTheme.subscribe(val => this.isDarkTheme = val);
    if (localStorage.getItem("isDarkTheme")==="true") {
      this.isDarkTheme = true;
      this.str_dark = "dark";
    } else {
      this.isDarkTheme = false;
      this.str_dark = "light";
    }
    this.thServ.callTheme.subscribe(
        () => {
          this.thServ.isDarkTheme.subscribe(val => this.isDarkTheme = val);
          if (localStorage.getItem("isDarkTheme")==="false") {
            this.isDarkTheme = false;
            this.str_dark = "light";
          } else {
            this.isDarkTheme = true;
            this.str_dark = "dark";
          }
        }
      );
  }

  send(text:string) {
    if (text != "") {
      const id = this.firestore.createId();
      this.fServ.contactus(id, 'contacts', this.username, text);
      $("#contactModal").modal('hide');
      $('textarea').val('')
      if (this.isLangThai) this._snackbar.open('ส่งข้อความนี้สำเร็จแล้ว!', 'ปิด');
      else this._snackbar.open('Send contact successfully!', 'Close');
    }
  }

  closeTab() {
    this.vip_expire = false;
  }
}
