import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-display-movie',
  templateUrl: './display-movie.component.html',
  styleUrls: ['./display-movie.component.css']
})
export class DisplayMovieComponent implements OnInit {
  
  isDarkTheme;
  str_dark;
  @Input() movie;

  list_genre = [];

  constructor(
    private lServ: LangService,
    private fServ : FirebaseService,
    private thServ: ThemeService
  ) { }

  avg_star;

  isLangThai : boolean = false;
  review_lang;

  user_vip;

  ngOnInit() {
    this.fServ.getUser(this.movie['postBy'], 'users').subscribe(val => {
      val.map(e => {
        this.user_vip = e.payload.doc.data()['vip'];
      })
    })
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.review_lang = "วิจารย์โดย"
    } else {
      this.isLangThai = false;
      this.review_lang = "Review by"
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.review_lang = "วิจารย์โดย"
      } else {
        this.isLangThai = false;
        this.review_lang = "Review by"
      }
    });
    let sum_star = 0;
    if (this.movie['star'].length == 0) this.avg_star = 0;
    else {
      this.movie['star'].forEach(obj => {
        let array = obj.split(':');
        sum_star += parseInt(array[1]);
      });
      this.avg_star = sum_star/this.movie['star'].length;
    }
    this.fServ.upRating(this.movie['id'], 'movies', (this.avg_star)+this.movie['star'].length);
    this.fServ.upStar(this.movie['id'], 'movies', this.avg_star);
    this.list_genre = this.movie['genre'];
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

}