import { Component, OnInit } from '@angular/core';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  submitted = false;
  isLoggedIn;

  isDarkTheme;
  str_dark: string;

  loginForm: FormGroup;

  name = "";

  constructor(
    private lServ: LangService,
    private route: Router,
    private form : FormBuilder,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private firestore: AngularFirestore,
    private afAuth : AngularFireAuth,
    private auth : AuthService,
    private _snackbar: MatSnackBar
  ) { }

  isLangThai : boolean = false;
  login_lang;
  name_lang;
  e_name_lang;
  r_name_lang;
  pass_lang;
  e_pass_lang;
  r_pass_lang;
  txt_re_lang;
  register_lang;

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.login_lang = "ล็อกอิน"
      this.name_lang = "ชื่อผู้ใช้"
      this.e_name_lang = "กรอกชื่อผู้ใช้"
      this.r_name_lang = "กรุณากรอกชื่อผู้ใช้"
      this.pass_lang = "รหัสผ่าน"
      this.e_pass_lang = "กรอกรหัสผ่าน"
      this.r_pass_lang = "กรุณากรอกรหัสผ่าน"
      this.txt_re_lang = "ถ้าคุณไม่มีบัญชีผู้ใช้? โปรด";
      this.register_lang = "สมัครสมาชิก";
    } else {
      this.isLangThai = false;
      this.login_lang = "Login"
      this.name_lang = "Username"
      this.e_name_lang = "Enter Username"
      this.r_name_lang = "Username is required"
      this.pass_lang = "Password"
      this.e_pass_lang = "Enter Password"
      this.r_pass_lang = "Password is required"
      this.txt_re_lang = "You don't have account? Please";
      this.register_lang = "Register";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.login_lang = "ล็อกอิน"
        this.name_lang = "ชื่อผู้ใช้"
        this.e_name_lang = "กรอกชื่อผู้ใช้"
        this.r_name_lang = "กรุณากรอกชื่อผู้ใช้"
        this.pass_lang = "รหัสผ่าน"
        this.e_pass_lang = "กรอกรหัสผ่าน"
        this.r_pass_lang = "กรุณากรอกรหัสผ่าน"
        this.txt_re_lang = "ถ้าคุณไม่มีบัญชีผู้ใช้? โปรด";
        this.register_lang = "สมัครสมาชิก";
      } else {
        this.isLangThai = false;
        this.login_lang = "Login"
        this.name_lang = "Username"
        this.r_name_lang = "Username is required"
        this.pass_lang = "Password"
        this.e_pass_lang = "Enter Password"
        this.r_pass_lang = "Password is required"
        this.txt_re_lang = "You don't have account? Please";
        this.register_lang = "Register";
      }
    });
    this.loginForm = this.form.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
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
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.route.navigate(['']);
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.isLoggedIn = true;
          this.route.navigate(['']);
        }
      });
    }
    this.auth.callAuth.subscribe(
      () => {
        this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
        if (localStorage.getItem("isLoggedIn")==="true") {
          this.isLoggedIn = true;
          this.route.navigate(['']);
          this.afAuth.auth.onAuthStateChanged(user => {
            if (user) {
              this.isLoggedIn = true;
              this.route.navigate(['']);
            }
          });
        }
      }
    );
  }

  get f() { return this.loginForm.controls; }

  login(person) {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.submitted = false;
      return;
    }
    
    this.firestore.collection('users').doc(this.f.username.value).get().subscribe(doc => {
      if (!doc.exists || doc.data()===undefined) {
        if (this.isLangThai) this._snackbar.open('รหัสผ่านไม่ถูกต้องหรือผู้ใช้ไม่มีรหัสผ่าน', 'ปิด');
        else this._snackbar.open('The password is invalid or the user does not have a password.', 'Close');
        this.submitted = false;
      } else {
        this.afAuth.auth.signInWithEmailAndPassword(doc.data()['email'], this.f.password.value).then(user => {
          if (this.isLangThai) this._snackbar.open('ล็อกอินด้วยผู้ใช้: '+user.user.displayName+' สำเร็จแล้ว!', 'ปิด');
          else this._snackbar.open('Login with username: '+user.user.displayName+' successfully!', 'Close');
          this.auth.login();
          this.auth.refreshAuth();
          this.route.navigate(['']);
        }).catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (this.isLangThai) {
            if (errorCode == "auth/wrong-password") this._snackbar.open("รหัสผ่านไม่ถูกต้องหรือผู้ใช้ไม่มีรหัสผ่าน", 'ปิด');
            else if (errorCode == "auth/too-many-requests") this._snackbar.open("มีการพยายามลงชื่อเข้าใช้ไม่สำเร็จหลายครั้งเกินไป โปรดลองอีกครั้งในภายหลัง", 'ปิด');
            else this._snackbar.open(errorMessage, 'ปิด');
          }
          else this._snackbar.open(errorMessage, 'Close');
          this.submitted = false;
        });
      }
    });
  }

  viewPassword() {
    if($('#show_hide_password input').attr("type") == "text"){
        $('#show_hide_password input').attr('type', 'password');
        $('#show_hide_password i').addClass( "fa-eye-slash" );
        $('#show_hide_password i').removeClass( "fa-eye" );
    }else if($('#show_hide_password input').attr("type") == "password"){
        $('#show_hide_password input').attr('type', 'text');
        $('#show_hide_password i').removeClass( "fa-eye-slash" );
        $('#show_hide_password i').addClass( "fa-eye" );
    }
  }

}