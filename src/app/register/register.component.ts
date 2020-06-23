import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

import * as firebase from 'firebase/app';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted;
  isNotSame = false;
  isLoggedIn;

  isDarkTheme;
  str_dark: string;

  name = "";

  level = "Normal";
  vip = false;

  link_str = "https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/147131.png?alt=media&token=056f08b4-8819-45fd-b9be-87e48ad34544";

  constructor(
    private lServ: LangService,
    private formBuilder: FormBuilder,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private firestore: AngularFirestore,
    private route : Router,
    private afAuth : AngularFireAuth,
    private storage: AngularFireStorage,
    private auth : AuthService,
    private _snackbar: MatSnackBar
  ) { }

  isLangThai : boolean = false;
  op_lang;
  c_op_lang;
  u_lang;
  img_lang;
  e_img_lang;
  name_lang;
  e_name_lang;
  r_name_lang;
  r2_name_lang
  email_lang;
  e_email_lang;
  r_email_lang;
  pass_lang;
  e_pass_lang;
  r_pass_lang;
  r2_pass_lang;
  pass2_lang;
  e_pass2_lang;
  r_pass2_lang;
  txt_re_lang;

  support_lang;
  price_lang;
  attribute_lang;

  vip1_lang;
  vip2_lang;
  vip3_lang;

  level_select_lang;

  register_lang;

  choose_op = 1;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  imgURL: string;

  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = 'https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/147131.png?alt=media&token=056f08b4-8819-45fd-b9be-87e48ad34544';
  editFile: boolean = true;
  removeUpload: boolean = false;

  imgName = "";
  imgfile;

  uploadFile(event) {
    let reader = new FileReader();
    let file = event.target.files[0];
    this.imgfile = file;
    this.imgName = file.name;
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      }
    }
  }

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.op_lang = "เลือกรูปแบบรูปโปรไฟล์";
      this.c_op_lang = "อัพโหลดรูปภาพ"
      this.u_lang = "อัพโหลดภาพ"
      this.img_lang = "ลิงค์รูปโปรไฟล์";
      this.e_img_lang = "กรอกลิงค์";
      this.name_lang = "ชื่อผู้ใช้";
      this.e_name_lang = "กรอกชื่อผู้ใช้";
      this.r_name_lang = "กรุณากรอกชื่อผู้ใช้";
      this.r2_name_lang = "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษอยู่!";
      this.email_lang = "อีเมล";
      this.e_email_lang = "กรอกอีเมล";
      this.r_email_lang = "กรุณากรอกอีเมล";
      this.pass_lang = "รหัสผ่าน";
      this.e_pass_lang = "กรอกรหัสผ่าน";
      this.r_pass_lang = "กรุณากรอกรหัสผ่าน";
      this.r2_pass_lang = "กรุณากรอกรหัสผ่านมากกว่า 6 ตัว";
      this.pass2_lang = "ยืนยันรหัสผ่าน";
      this.e_pass2_lang = "กรอกยืนยันรหัสผ่าน";
      this.r_pass2_lang = "กรุณากรอกยืนยันรหัสผ่าน";
      this.txt_re_lang = "ถ้าคุณไม่มีบัญชีผู้ใช้? โปรด";
      this.register_lang = "สมัครสมาชิก";
      this.support_lang = "สนับสนุน";
      this.price_lang = "ราคา";
      this.attribute_lang = "คุณสมบัติ";
      this.vip1_lang = "ซื้อสมาชิก VIP";
      this.vip2_lang = "สามารถดูวิดีโอของ";
      this.vip3_lang = "ที่อยู่ภายในทุกบทวิจารย์! เพียง ฿129/เดือนเท่านั้น";
      this.level_select_lang = "เลือกระดับการใช้งานของคุณ";
    } else {
      this.isLangThai = false;
      this.op_lang = "Choose options image profile";
      this.c_op_lang = "Upload Image File"
      this.u_lang = "Upload Image"
      this.img_lang = "Image Profile Link"
      this.e_img_lang = "Enter URL";
      this.name_lang = "Username";
      this.e_name_lang = "Enter Username";
      this.r_name_lang = "Username is required";
      this.r2_name_lang = "Username don't have contain special characters!";
      this.email_lang = "Email";
      this.e_email_lang = "Enter Email";
      this.r_email_lang = "Email is required";
      this.pass_lang = "Password";
      this.e_pass_lang = "Enter Password";
      this.r_pass_lang = "Password is required";
      this.r2_pass_lang = "Password must be at least 6 characters";
      this.pass2_lang = "Confirm Password";
      this.e_pass2_lang = "Enter Confirm Password";
      this.r_pass2_lang = "Confirm Password is required";
      this.txt_re_lang = "You don't have account? Please";
      this.register_lang = "Register";
      this.support_lang = "Support";
      this.price_lang = "Price";
      this.attribute_lang = "Attribute";
      this.vip1_lang = "Purchase VIP member";
      this.vip2_lang = "Can Watch Movie of";
      this.vip3_lang = "inside the reviews! Only $3.99/month.";
      this.level_select_lang = "Choose your usage level";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.op_lang = "เลือกรูปแบบรูปโปรไฟล์";
        this.c_op_lang = "อัพโหลดรูปภาพ"
        this.u_lang = "อัพโหลดภาพ"
        this.img_lang = "ลิงค์รูปโปรไฟล์";
        this.e_img_lang = "กรอกลิงค์";
        this.name_lang = "ชื่อผู้ใช้";
        this.e_name_lang = "กรอกชื่อผู้ใช้";
        this.r2_name_lang = "ชื่อผู้ใช้ต้องไม่มีอักขระพิเศษอยู่!";
        this.r_name_lang = "กรุณากรอกชื่อผู้ใช้";
        this.email_lang = "อีเมล";
        this.e_email_lang = "กรอกอีเมล";
        this.r_email_lang = "กรุณากรอกอีเมล";
        this.pass_lang = "รหัสผ่าน";
        this.e_pass_lang = "กรอกรหัสผ่าน";
        this.r_pass_lang = "กรุณากรอกรหัสผ่าน";
        this.r2_pass_lang = "กรุณากรอกรหัสผ่านมากกว่า 6 ตัว";
        this.pass2_lang = "ยืนยันรหัสผ่าน";
        this.e_pass2_lang = "กรอกยืนยันรหัสผ่าน";
        this.r_pass2_lang = "กรุณากรอกยืนยันรหัสผ่าน";
        this.txt_re_lang = "ถ้าคุณไม่มีบัญชีผู้ใช้? โปรด";
        this.register_lang = "สมัครสมาชิก";
        this.support_lang = "สนับสนุน";
        this.price_lang = "ราคา";
        this.attribute_lang = "คุณสมบัติ";
        this.vip1_lang = "ซื้อสมาชิก VIP";
        this.vip2_lang = "สามารถดูวิดีโอของ";
        this.vip3_lang = "ที่อยู่ภายในทุกบทวิจารย์! เพียง ฿129/เดือนเท่านั้น";
        this.level_select_lang = "เลือกระดับการใช้งานของคุณ";
      } else {
        this.isLangThai = false;
        this.op_lang = "Choose options image profile";
        this.c_op_lang = "Upload Image File"
        this.u_lang = "Upload Image"
        this.img_lang = "Image Profile Link";
        this.e_img_lang = "Enter URL";
        this.name_lang = "Username";
        this.e_name_lang = "Enter Username"
        this.r_name_lang = "Username is required";
        this.r2_name_lang = "Username don't have contain special characters!";
        this.email_lang = "Email";
        this.e_email_lang = "Enter Email";
        this.r_email_lang = "Email is required";
        this.pass_lang = "Password";
        this.e_pass_lang = "Enter Password";
        this.r_pass_lang = "Password is required";
        this.r2_pass_lang = "Password must be at least 6 characters";
        this.pass2_lang = "Confirm Password";
        this.e_pass2_lang = "Enter Confirm Password";
        this.r_pass2_lang = "Confirm Password is required";
        this.txt_re_lang = "You don't have account? Please";
        this.register_lang = "Register";
        this.support_lang = "Support";
        this.price_lang = "Price";
        this.attribute_lang = "Attribute";
        this.vip1_lang = "Purchase VIP member";
        this.vip2_lang = "Can Watch Movie of";
        this.vip3_lang = "inside the reviews! Only $3.99/month.";
        this.level_select_lang = "Choose your usage level";
      }
    });
    this.registerForm = this.formBuilder.group({
      link: [''],
      username: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9ก-๏]+$')]],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
    });
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

  get f() { return this.registerForm.controls; }

  get_link(link:string) {
    if (link != "") this.link_str = link;
    else this.link_str = 'https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/147131.png?alt=media&token=056f08b4-8819-45fd-b9be-87e48ad34544';
  }

  startUpload() {
    const path = `img_profiles/${Date.now()}_${this.imgName}`;
    const ref = this.storage.ref(path);
    this.task = this.storage.upload(path, this.imgfile);
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(tap(), finalize(async() => {
        this.imgURL = await ref.getDownloadURL().toPromise();
        this.fServ.registerUser(this.f.username.value, 'users', this.f.username.value, this.f.email.value, this.level, this.imgURL, this.vip);
        if (this.isLangThai) this._snackbar.open('สมัครสมาชิกสำเร็จแล้ว!', 'ปิด');
        else this._snackbar.open('Register successfully!', 'Close');
        this.route.navigate(['login']);
      }),
    );
  }

  register() {
    this.submitted = true;
    //stop here if form is invalid
    if (this.registerForm.invalid) {
      this.submitted = false;
      if (this.isLangThai) this._snackbar.open('โปรดกรอกรายละเอียดแบบฟอร์มให้ครบ!', 'ปิด');
      else this._snackbar.open('Please complete the form!', 'Close');
      return;
    }

    if (this.f.password.value !== this.f.password2.value) {
      this.isNotSame = true;
      this.submitted = false;
      if (this.isLangThai) this._snackbar.open('รหัสผ่านกับยืนรหัสผ่านไม่ตรงกัน!', 'ปิด');
      else this._snackbar.open('Password and Confirm Password does not match!', 'Close');
    } else {
      this.isNotSame = false;
      this.submitted = true;
      this.firestore.collection('users').doc(this.f.username.value).get().subscribe(doc => {
        if (doc.exists) {
          this.name = this.f.username.value;
          if (this.isLangThai) this._snackbar.open('ชื่อผู้ใช้: '+this.f.username.value+' มีอยู่แล้ว! โปรดลองใช้ชื่ออื่น.', 'ปิด');
          else this._snackbar.open('Username: '+this.f.username.value+' already exists! Please try other username.', 'Close');
          this.submitted = false;
        } else {
          this.afAuth.auth.createUserWithEmailAndPassword(this.f.email.value, this.f.password.value).then(user => {
            user.user.updateProfile({
              displayName: this.f.username.value,
              photoURL: this.link_str
            });
            if (this.choose_op == 1) {
              if (this.imageUrl != 'https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/147131.png?alt=media&token=056f08b4-8819-45fd-b9be-87e48ad34544') this.startUpload();
              else {
                this.fServ.registerUser(this.f.username.value, 'users', this.f.username.value, this.f.email.value, this.level, this.link_str, this.vip);
                if (this.isLangThai) this._snackbar.open('สมัครสมาชิกสำเร็จแล้ว!', 'ปิด');
                else this._snackbar.open('Register successfully!', 'Close');
                this.route.navigate(['login']);
              }
            } else {
              this.fServ.registerUser(this.f.username.value, 'users', this.f.username.value, this.f.email.value, this.level, this.link_str, this.vip);
              if (this.isLangThai) this._snackbar.open('สมัครสมาชิกสำเร็จแล้ว!', 'ปิด');
              else this._snackbar.open('Register successfully!', 'Close');
              this.route.navigate(['login']);
            }
          }).catch(error => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (this.isLangThai) {
              if (errorCode == "auth/email-already-in-use") this._snackbar.open("อีเมลนี้ถูกใช้ไปแล้ว", 'ปิด');
              else if (errorCode == "auth/invalid-email") this._snackbar.open("รูปแบบอีเมลไม่ถูกต้อง", 'ปิด');
              else this._snackbar.open(errorMessage, 'ปิด');
            } else this._snackbar.open(errorMessage, 'Close');
            this.submitted = false;
          });
        }
      });
    }
  }

  changeLevel(level) {
    switch (level.index) {
      case 0: this.level = "Normal"; break;
      case 1: this.level = "Gold"; break;
      case 2: this.level = "Premium"; break;
    }
  }

  changeOption() {
    if ($('#upload').is(":checked")) this.choose_op = 1;
    if ($('#linkurl').is(":checked")) this.choose_op = 2;
  }

  buyvip() {
    if (!this.vip) this.vip = true;
    else this.vip = false;
  }

}