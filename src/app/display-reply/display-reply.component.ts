import { Component, OnInit, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';
import { LangService } from '../lang.service';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-display-reply',
  templateUrl: './display-reply.component.html',
  styleUrls: ['./display-reply.component.css']
})
export class DisplayReplyComponent implements OnInit {

  isDarkTheme;
  str_dark: string;
  isLoggedIn : boolean = false;
  username: string;
  isLangThai;

  @Input() reply;

  constructor(
    private lServ: LangService,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private firestore: AngularFirestore,
    private afAuth : AngularFireAuth,
    private auth : AuthService
  ) { }

  like_num;
  dislike_num;

  curr_user;

  userLike;
  userDislike;

  com_level;

  ngOnInit() {
    this.fServ.getUser(this.reply.user, 'users').subscribe( v => {
      v.map( e => {
        this.com_level = e.payload.doc.data()['level'];
      })
    });
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
    this.like_num = this.reply['like'].length;
    this.dislike_num = this.reply['dislike'].length;
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
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.displayName;
          this.isLoggedIn = true;
          if (this.reply!==undefined) {
            if (this.reply['like'].indexOf(this.username) !== -1) this.userLike = "true";
            else this.userLike = "false";
            if (this.reply['dislike'].indexOf(this.username) !== -1) this.userDislike = "true";
            else this.userDislike = "false";
          }
          this.fServ.getUser(user.displayName, 'users').subscribe( v=> {
          this.curr_user = v.map( e => {
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
              if (this.reply!==undefined) {
                if (this.reply['like'].indexOf(this.username) !== -1) this.userLike = "true";
                else this.userLike = "false";
                if (this.reply['dislike'].indexOf(this.username) !== -1) this.userDislike = "true";
                else this.userDislike = "false";
              }
              this.fServ.getUser(user.displayName, 'users').subscribe( v=> {
              this.curr_user = v.map( e => {
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
  }

  like() {
    if (this.reply['like'].indexOf(this.username)!==-1) this.fServ.unlikeComment(this.reply['id'], 'replys', this.username); else {
      if (this.reply['dislike'].indexOf(this.username)!==-1) this.fServ.undislikeComment(this.reply['id'], 'replys', this.username);
      this.fServ.likeComment(this.reply['id'], 'replys', this.username);
    }
    
  }

  dislike() {
    if (this.reply['dislike'].indexOf(this.username)!==-1) this.fServ.undislikeComment(this.reply['id'], 'replys', this.username);
    else {
      if (this.reply['like'].indexOf(this.username)!==-1) this.fServ.unlikeComment(this.reply['id'], 'replys', this.username);
      this.fServ.dislikeComment(this.reply['id'], 'replys', this.username);
    }
  }

}