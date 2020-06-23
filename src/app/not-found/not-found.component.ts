import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  isDarkTheme;
  str_dark: string;

  constructor(
    private lServ: LangService,
    private route : Router,
    private thServ: ThemeService
  ) { }

  isLangThai;
  notfound_lang;
  back_lang;

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

  goback() {
    this.route.navigate(['']);
  }

}