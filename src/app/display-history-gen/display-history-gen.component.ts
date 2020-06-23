import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-display-history-gen',
  templateUrl: './display-history-gen.component.html',
  styleUrls: ['./display-history-gen.component.css']
})
export class DisplayHistoryGenComponent implements OnInit {

  isDarkTheme;
  str_dark: string;
  isLangThai;

  @Input() history;

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