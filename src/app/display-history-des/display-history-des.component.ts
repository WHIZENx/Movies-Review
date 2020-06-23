import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-display-history-des',
  templateUrl: './display-history-des.component.html',
  styleUrls: ['./display-history-des.component.css']
})
export class DisplayHistoryDesComponent implements OnInit {

  @Input() history;
  isDarkTheme;
  str_dark: string;
  isLangThai;

  constructor(
    private lServ: LangService,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
    } else {
      this.isLangThai = false;
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
      } else {
        this.isLangThai = false;
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

}