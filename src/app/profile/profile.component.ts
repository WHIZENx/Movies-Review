import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { FirebaseService } from '../firebase.service';
import { AuthService } from '../auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LangService } from '../lang.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editForm: FormGroup;

  isLoggedIn;
  id_url : string;
  isDarkTheme;
  str_dark: string;

  current_name;
  username : string;

  support_lang;
  price_lang;
  attribute_lang;

  notfound_lang;
  back_lang;

  level = "Normal";
  level_index = 0;
  number_cheer;

  cheer_lang;
  reviewdate_lang;

  constructor(
    private lServ: LangService,
    private formBuilder: FormBuilder,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private route : Router,
    private afAuth : AngularFireAuth,
    private auth : AuthService,
    private firestore: AngularFirestore,
    private _snackbar: MatSnackBar
  ) {
    this.route.events.subscribe((val) => {
      this.id_url = this.route.url.split('/')[2];
      if (this.id_url!==undefined) {
        this.fServ.getUser(this.id_url, 'users').subscribe(val => {
          this.user = val.map( e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
              }
          })
        });
      }
      this.fServ.getMovies(this.id_url, 'movies').subscribe(val => {
      this.sum_movie = 0;
      this.list_genre =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.movies = val.map( e => {
        this.sum_movie++;
        this.number_cheer = e.payload.doc.data()['star'].length;
        e.payload.doc.data()['genre'].forEach(obj => {
          this.list_genre[this.genres.indexOf(obj)]++;
        });
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
        })
        // Chart
        this.typeChart = 'bar'; //'line','bar','radar','pie','doughnut','polarArea','bubble','scatter'
        this.dataChart = {
          labels: this.genres,
          datasets: [
            {
              label: "Genres Stats Chart",
              data: this.list_genre,
              backgroundColor : ['blue', 'pink', 'yellow', 'purple', 'red', 'greenyellow', 'orange', 'gold', 'darkgreen', 'silver', 'aqua','brown', 'indigo', 'gray', 'palegreen']
            }
          ]
        };
        this.optionsChart = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                max: (Math.max(...this.list_genre))*2,
                min: 0,
                stepSize: Math.max(...this.list_genre)
              }
            }]
          }
        };
    });
    });
  }

  user;
  movies;
  typeChart: any;
  dataChart: any;
  optionsChart: any;

  genres = ["Action",
            "Animation",
            "Comedy",
            "Crime",
            "Drama",
            "Experimental",
            "Fantasy",
            "Historical",
            "Horror",
            "Science Fiction",
            "Thriller",
            "Western",
            "Musical",
            "War",
            "Other"];
            
  list_genre =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

  sum_movie = 0;

  isLangThai;
  name_lang;
  level_lang;
  edit_lang;
  review_lang;
  result_lang;
  expire_lang;
  vip_ex_lang;

  vip1_lang;
  vip2_lang;
  vip3_lang;

  genre_lang;

  buy_level_lang;
  buy_lang;
  close_lang;

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.name_lang = "ชื่อ";
      this.level_lang = "ระดับ";
      this.edit_lang = "เปลี่ยนระดับ";
      this.review_lang = "บทวิจารย์หนังโดย";
      this.result_lang = "ผลลัพท์ของบทวิจารย์";
      this.expire_lang = "วันหมดอายุ VIP";
      this.vip_ex_lang = "ซื้อ VIP";
      this.support_lang = "สนับสนุน";
      this.price_lang = "ราคา";
      this.attribute_lang = "คุณสมบัติ";
      this.buy_level_lang = "ซื้อระดับ";
      this.buy_lang = "ซื้อ";
      this.close_lang = "ปิด";
      this.genre_lang = "ประเภท";
      this.notfound_lang = "ขออภัย แต่ชื่อผู้ใช้ที่คุณกำลังค้นหาไม่มีอยู่";
      this.back_lang = "กลับหน้าหลัก";
      this.vip1_lang = "ซื้อสมาชิก VIP";
      this.vip2_lang = "สามารถดูวิดีโอของ";
      this.vip3_lang = "ที่อยู่ภายในทุกบทวิจารย์! เพียง ฿129/เดือนเท่านั้น";
      this.cheer_lang = "เชียร์";
      this.reviewdate_lang = "วิจารย์เมื่อ";
    } else {
      this.isLangThai = false;
      this.name_lang = "Name";
      this.level_lang = "Level";
      this.edit_lang = "Change Level";
      this.review_lang = "Movie Review by";
      this.result_lang = "Result number of reviews";
      this.expire_lang = "Expire VIP";
      this.expire_lang = "Expire";
      this.vip_ex_lang = "Purchase VIP";
      this.support_lang = "Support";
      this.price_lang = "Price";
      this.attribute_lang = "Attribute";
      this.buy_level_lang = "Buy Level";
      this.buy_lang = "Buy";
      this.close_lang = "Close";
      this.genre_lang = "Genre";
      this.notfound_lang = "We are sorry but the user you are looking for does not exits.";
      this.back_lang = "Go back home";
      this.vip1_lang = "Purchase VIP member";
      this.vip2_lang = "Can Watch Movie of";
      this.vip3_lang = "inside the reviews! Only $3.99/month.";
      this.cheer_lang = "Cheers";
      this.reviewdate_lang = "Review date";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.name_lang = "ชื่อ";
        this.level_lang = "ระดับ";
        this.edit_lang = "เปลี่ยนระดับ";
        this.review_lang = "บทวิจารย์หนังโดย";
        this.result_lang = "ผลลัพท์ของบทวิจารย์";
        this.expire_lang = "วันหมดอายุ VIP"
        this.support_lang = "สนับสนุน";
        this.price_lang = "ราคา";
        this.attribute_lang = "คุณสมบัติ";
        this.buy_level_lang = "ซื้อระดับ";
        this.buy_lang = "ซื้อ";
        this.close_lang = "ปิด";
        this.genre_lang = "ประเภท";
        this.notfound_lang = "ขออภัย แต่ชื่อผู้ใช้ที่คุณกำลังค้นหาไม่มีอยู่";
        this.back_lang = "กลับหน้าหลัก";
        this.vip1_lang = "ซื้อสมาชิก VIP";
        this.vip2_lang = "สามารถดูวิดีโอของ";
        this.vip3_lang = "ที่อยู่ภายในทุกบทวิจารย์! เพียง ฿129/เดือนเท่านั้น";
        this.cheer_lang = "เชียร์";
        this.reviewdate_lang = "วิจารย์เมื่อ";
      } else {
        this.isLangThai = false;
        this.name_lang = "Name";
        this.level_lang = "Level";
        this.edit_lang = "Change Level";
        this.review_lang = "Movie Review by";
        this.result_lang = "Result number of reviews";
        this.expire_lang = "Expire VIP";
        this.vip_ex_lang = "Purchase VIP";
        this.support_lang = "Support";
        this.price_lang = "Price";
        this.attribute_lang = "Attribute";
        this.buy_level_lang = "Buy Level";
        this.buy_lang = "Buy";
        this.close_lang = "Close";
        this.genre_lang = "Genre";
        this.notfound_lang = "We are sorry but the user you are looking for does not exits.";
        this.back_lang = "Go back home";
        this.vip1_lang = "Purchase VIP member";
        this.vip2_lang = "Can Watch Movie of";
        this.vip3_lang = "inside the reviews! Only $3.99/month.";
        this.cheer_lang = "Cheers";
        this.reviewdate_lang = "Review date";
      }
    });
    this.editForm = this.formBuilder.group({
        link: ['', Validators.required],
        name: ['', Validators.required],
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
      this.afAuth.auth.onAuthStateChanged(user => {
        this.isLoggedIn = true;
        if (user) {
          this.username = user.displayName;
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
            }
          });
        }
      }
    );
  }

  get f() { return this.editForm.controls; }

  isEmpty(u) {
    if(u!==undefined) return u.length == 0;
  }

  user_name;
  user_level;
  user_photo;
  user_email;
  user_expire;

  modalVip(name) {
    const today = new Date();
    const expire = new Date(today.setMonth(today.getMonth() + 1));
    this.user_name = name;
    this.user_expire = expire;
  }

  modalEdit(name, level, photo, email) {
    this.user_name = name;
    this.user_level = level;
    this.user_photo = photo;
    this.user_email = email;
    this.changeLevel(level); 
  }

  buylevelUser() {
    if (this.level != this.user_level) {
      this.fServ.updateLevelUser(this.user_name, 'users', this.level);
      if (this.isLangThai) this._snackbar.open('ซื้อระดับ '+this.level+' สำเร็จแล้ว!', 'ปิด');
      else this._snackbar.open('Buy level '+this.level+' successfully!', 'ปิด');
    } else {
      if (this.isLangThai) this._snackbar.open('คุณอยู่ในระดับที่เลือกอยู่แล้ว! โปรดลองอีกครั้ง', 'ปิด');
      else this._snackbar.open('You have been this level! Please try again', 'Close');
    }
  }

  goback() {
    this.route.navigate(['']);
  }

  checkUser() {
    this.id_url = this.route.url.split('/')[2];
    return true;
  }

  changeLevel(level) {
    if (level == 'Admin') this.level = "Premium";
    else {
      switch (level.index) {
        case 0: this.level = "Normal"; break;
        case 1: this.level = "Gold"; break;
        case 2: this.level = "Premium"; break;
      }
    }
  }

  buyvip() {
    this.fServ.buyVip(this.user_name, 'users');
    if (this.isLangThai) this._snackbar.open('ซื้อ VIP member สำเร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Purchase VIP member successfull!', 'Close');
  }

  incView(id : string) {
    this.fServ.upView(id, 'movies');
  }
}