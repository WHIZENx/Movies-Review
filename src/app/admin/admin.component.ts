import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { ThemeService } from '../theme.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from '@angular/material/snack-bar';
import { LangService } from '../lang.service';
import { AuthService } from '../auth.service';

declare var require: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isLoggedIn : boolean = false;
  username: string;

  isDarkTheme;
  str_dark: string;

  constructor(
    private lServ: LangService,
    private fServ : FirebaseService,
    private route : Router,
    private thServ: ThemeService,
    private afAuth : AngularFireAuth,
    private _snackbar: MatSnackBar,
    private auth : AuthService,
  ) { }

  contacts;
  movies;
  users;
  banners;

  error = false;

  typeChart: any;
  dataChart: any;
  optionsChart: any;

  typeChart2: any;
  dataChart2: any;
  optionsChart2: any;

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

  levels = ["Normal", "Gold", "Premium", "Admin"];
  list_level = [0,0,0,0];

  loading = false;

  isLangThai;
  notfound_lang;
  back_lang;

  today;
  str_date;

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.notfound_lang = "ขออภัย แต่หน้าเว็บที่คุณกำลังค้นหาไม่มีอยู่";
      this.back_lang = "กลับหน้าหลัก";
    } else {
      this.isLangThai = false;
      this.notfound_lang = "We are sorry but the page you are looking for does not exit.";
      this.back_lang = "Go back home";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.notfound_lang = "ขออภัย แต่หน้าเว็บที่คุณกำลังค้นหาไม่มีอยู่";
        this.back_lang = "กลับหน้าหลัก";
      } else {
        this.isLangThai = false;
        this.notfound_lang = "We are sorry but the page you are looking for does not exit.";
        this.back_lang = "Go back home";
      }
    });
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.displayName;
          this.isLoggedIn = true;
          this.fServ.getUser(user.displayName, 'users').subscribe(val => {
            val.map( e => {
              if (e.payload.doc.data()['level'] != 'Admin') {
                this.error = true;
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
              this.fServ.getUser(user.displayName, 'users').subscribe(val => {
                val.map( e => {
                  if (e.payload.doc.data()['level'] != 'Admin') {
                    this.error = true;
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
    this.fServ.getDatas('movies').subscribe(val => {
      this.list_genre =  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.movies = val.map( e => {
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
                max: (Math.max(...this.list_genre)-1)*2,
                min: 0,
                stepSize: Math.max(...this.list_genre)
              }
            }]
          }
        };
    });
    this.fServ.getUsers('users').subscribe(val => {
      this.list_level = [0,0,0,0];
      this.users = val.map( e => {
        this.list_level[this.levels.indexOf(e.payload.doc.data()['level'])]++;
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
        })
         // Chart
        this.typeChart2 = 'bar'; //'line','bar','radar','pie','doughnut','polarArea','bubble','scatter'
        this.dataChart2 = {
          labels: this.levels,
          datasets: [
            {
              label: "Levels Stats Chart",
              data: this.list_level,
              backgroundColor : ['black', 'gold', '#2ebcef', 'red']
            }
          ]
        };
        this.optionsChart2 = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                max: (Math.max(...this.list_level))*2,
                min: 0,
                stepSize: Math.max(...this.list_level)
              }
            }]
          }
        };
        this.loading = true;
    });
    this.fServ.getDatas('contacts').subscribe(val => {
      this.contacts = val.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
        })
    });
  }

  resetReview(id, id_list, id_list_reply) {
    id_list_reply.forEach(obj => {
      this.fServ.deleteData(obj, 'replys');
    });
    id_list.forEach(obj2 => {
      this.fServ.deleteData(obj2, 'comments');
    });
    this.movie_id_list_his_des.forEach(obj => {
      this.fServ.deleteData(obj, 'history_des');
    });
    this.movie_id_list_his_gen.forEach(obj => {
      this.fServ.deleteData(obj, 'history_gen');
    });
    this.fServ.resetData(id, 'movies');
    this._snackbar.open('Reset review successfully!', 'Close');
  }

  deleteReview(id, id_list, id_list_reply) {
    id_list_reply.forEach(obj => {
      this.fServ.deleteData(obj, 'replys');
    });
    id_list.forEach(obj2 => {
      this.fServ.deleteData(obj2, 'comments');
    });
    this.movie_id_list_his_des.forEach(obj => {
      this.fServ.deleteData(obj, 'history_des');
    });
    this.movie_id_list_his_gen.forEach(obj => {
      this.fServ.deleteData(obj, 'history_gen');
    });
    this.fServ.deleteData(id, 'movies');
    this._snackbar.open('Delete review successfully!', 'Close');
  }

  banUser(name, status) {
    this.fServ.banUser(name, 'users', status);
    this._snackbar.open('Edit status user: '+name+' successfully!', 'Close');
  }

  select_level;

  editUser(name, date) {
    this.fServ.editUserVIP(name, 'users', name, $('.vip_select').val(), date);
    if ($('.level_select').val() != this.user_level) this.fServ.editUser(name, 'users', name, $('.level_select').val());
    this._snackbar.open('Edit user: '+name+' successfully!', 'Close');
  }

  user_name;
  user_level;
  user_status;
  user_photo;
  user_vip

  modalBan(name, status) {
    this.user_name = name;
    this.user_status = status;
  }

  modalEdit(name, level, photo, vip) {
    this.user_name = name;
    this.user_level = level;
    this.user_photo = photo;
    this.user_vip = vip;
    const today = new Date();
    const min = new Date(today.setDate(today.getDate() + 1));
    this.str_date = new Date(min).toISOString().split("T")[0];
  }

  movie_name;
  movie_id;
  movie_ld_list;
  movie_id_list_reply;
  movie_id_list_his_des;
  movie_id_list_his_gen;

  modalDelete(id, name, id_list, id_list_reply, id_list_his_des, id_list_his_gen) {
    this.movie_name = name;
    this.movie_id = id;
    this.movie_ld_list = id_list;
    this.movie_id_list_reply = id_list_reply;
    this.movie_id_list_his_des = id_list_his_des;
    this.movie_id_list_his_gen = id_list_his_gen;
  }

  modalReset(id, name, id_list, id_list_reply, id_list_his_des, id_list_his_gen) {
    this.movie_name = name;
    this.movie_id = id;
    this.movie_ld_list = id_list;
    this.movie_id_list_reply = id_list_reply;
    this.movie_id_list_his_des = id_list_his_des;
    this.movie_id_list_his_gen = id_list_his_gen;
  }

  goback() {
    this.route.navigate(['']);
  }

  deleteContact(id) {
    this.fServ.deleteData(id, 'contacts');
    this._snackbar.open('Delete contact successfully!', 'Close');
  }

}