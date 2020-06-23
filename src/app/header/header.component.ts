import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { AuthService } from '../auth.service';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoggedIn : boolean = false;
  username: string;

  isVip = false;

  isLangThai : boolean = false;

  slider = {
    'disabled': false,
  }

  isDarkTheme = false;
  str_dark = "false";
  nav_class: string;
  btn_reg_class: string;
  btn_log_class: string;
  time : Date;

  level : string;
  status : string;

  flag_lang;
  text_lang;
  home_lang;
  write_lang;
  login_lang;
  logout_lang;
  welcome_lang
  profile_lang;
  admin_lang;

  constructor(
    private thServ: ThemeService,
    private lServ: LangService,
    private fServ : FirebaseService,
    private afAuth : AngularFireAuth,
    private auth : AuthService,
    private route : Router,
    private _snackbar: MatSnackBar
  ) {
    setInterval(() => {
      this.time = new Date()
    }, 1000)
  }

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.flag_lang = "https://cdn.countryflags.com/thumbs/thailand/flag-round-250.png"
      this.text_lang = "ไทย";
      this.home_lang = "หน้าหลัก";
      this.write_lang = "เขียนบทวิจารย์";
      this.login_lang = "ล็อกอิน";
      this.logout_lang = "ล็อกเอาท์";
      this.welcome_lang = "สวัสดี";
      this.profile_lang = "ข้อมูลส่วนตัว";
      this.admin_lang = "ระบบแอดมิน";
    } else {
      this.isLangThai = false;
      this.flag_lang = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/United-kingdom_flag_icon_round.svg/768px-United-kingdom_flag_icon_round.svg.png"
      this.text_lang = "ENG";
      this.home_lang = "Home";
      this.write_lang = "Write Review";
      this.login_lang = "Login";
      this.logout_lang = "Logout";
      this.welcome_lang = "Welcome";
      this.profile_lang = "Profile";
      this.admin_lang = "Admin manager";
    }
    this.lServ.callLang.subscribe(() => {
         if (localStorage.getItem("isLangThai")==="true") {
          this.isLangThai = true;
          this.flag_lang = "https://cdn.countryflags.com/thumbs/thailand/flag-round-250.png"
          this.text_lang = "ไทย";
          this.home_lang = "หน้าหลัก";
          this.write_lang = "เขียนบทวิจารย์";
          this.login_lang = "ล็อกอิน";
          this.logout_lang = "ล็อกเอาท์";
          this.welcome_lang = "สวัสดี";
          this.profile_lang = "ข้อมูลส่วนตัว";
          this.admin_lang = "ระบบแอดมิน";
        }
        else {
          this.isLangThai = false;
          this.flag_lang = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/United-kingdom_flag_icon_round.svg/768px-United-kingdom_flag_icon_round.svg.png"
          this.text_lang = "ENG";
          this.home_lang = "Home"
          this.write_lang = "Write Review";
          this.login_lang = "Login";
          this.logout_lang = "Logout";
          this.welcome_lang = "Welcome";
          this.profile_lang = "Profile";
          this.admin_lang = "Admin manager";
        }
      }
    );
    this.thServ.isDarkTheme.subscribe(val => this.isDarkTheme = val);
    if (localStorage.getItem("isDarkTheme")==="true") {
      this.isDarkTheme = true;
      this.str_dark = "dark";
      this.nav_class = "navbar-dark";
    } else {
      this.isDarkTheme = false;
      this.str_dark = "light";
      this.nav_class = "navbar-light bg-light";
    }
    this.thServ.callTheme.subscribe(
      () => {
        this.thServ.isDarkTheme.subscribe(val => this.isDarkTheme = val);
        if (localStorage.getItem("isDarkTheme")==="true") {
          this.isDarkTheme = true;
          this.str_dark = "dark";
          this.nav_class = "navbar-dark";
        } else {
          this.isDarkTheme = false;
          this.str_dark = "light";
          this.nav_class = "navbar-light bg-light";
        }
      }
    );
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.displayName;
          this.isLoggedIn = true;
          this.fServ.getUser(user.displayName, 'users').subscribe(val => {
            val.map( e => {
              this.level =  e.payload.doc.data()['level'];
              this.status = e.payload.doc.data()['status'];
              this.isVip = e.payload.doc.data()['vip'];
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
              this.fServ.getUser(user.displayName, 'users').subscribe(val => {
                val.map( e => {
                  this.level =  e.payload.doc.data()['level'];
                  this.status = e.payload.doc.data()['status'];
                  this.isVip = e.payload.doc.data()['vip'];
                })
              });
            }
          });
        }
      }
    );
    
  }

  changetheme() {
    if (this.isDarkTheme) {
      this.str_dark = "light";
      this.thServ.lighttheme();
      this.thServ.refreshTheme();
      if (localStorage.getItem("isDarkTheme")==="false") {
        this.isDarkTheme = false;
      }
    } else {
      this.str_dark = "dark";
      this.thServ.darktheme();
      this.thServ.refreshTheme();
      if (localStorage.getItem("isDarkTheme")==="true") {
        this.isDarkTheme = true;
      }
    }
  }

  changelang() {
    if (this.isLangThai) {
      this.lServ.langEng();
      this.lServ.refreshLang();
      if (localStorage.getItem("isLangThai")==="false") {
        this.isLangThai = false;
      }
    } else {
      this.lServ.langThai();
      this.lServ.refreshLang();
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
      }
    }
  }

  logout() {
    this.afAuth.auth.signOut();
    this.auth.refreshAuth();
    this.auth.logout();
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    localStorage.setItem('isLoggedIn', 'false');
    if (localStorage.getItem("isLoggedIn")==="false") {
      this.isLoggedIn = false;
      this.username = "";
    }
    if (this.isLangThai) this._snackbar.open('ล็อกเอาท์สำเร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Logout successfully!', 'Close');
    this.route.navigate(['login']);
  }

}