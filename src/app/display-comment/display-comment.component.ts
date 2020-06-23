import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-display-comment',
  templateUrl: './display-comment.component.html',
  styleUrls: ['./display-comment.component.css']
})
export class DisplayCommentComponent implements OnInit {

  isDarkTheme;
  str_dark: string;
  isLoggedIn : boolean = false;
  username: string;
  isLangThai;

  id_movie;

  constructor(
    private lServ: LangService,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private route : Router,
    private firestore: AngularFirestore,
    private afAuth : AngularFireAuth,
    private auth : AuthService,
    private _snackbar: MatSnackBar
  ) { 
    this.id_movie = this.route.url.split('/')[2];
  }

  @Input() comment;
  like_num;
  dislike_num;

  userLike;
  userDislike;

  curr_user;
  reply;

  timeLang = "timeAgoThai";
  com_level;

  ngOnInit() {
    this.fServ.getUser(this.comment.user, 'users').subscribe( v => {
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
    this.like_num = this.comment['like'].length;
    this.dislike_num = this.comment['dislike'].length;
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
          if (this.comment!==undefined) {
            if (this.comment['like'].indexOf(this.username) !== -1) this.userLike = "true";
            else this.userLike = "false";
            if (this.comment['dislike'].indexOf(this.username) !== -1) this.userDislike = "true";
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
              if (this.comment!==undefined) {
                if (this.comment['like'].indexOf(this.username) !== -1) this.userLike = "true";
                else this.userLike = "false";
                if (this.comment['dislike'].indexOf(this.username) !== -1) this.userDislike = "true";
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
    this.fServ.getReplys(this.comment.id, 'replys').subscribe(val => {
      this.reply = val.map( e => {
         return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
      }).sort((b,a) => (a.like.length-a.dislike.length)-(b.like.length-b.dislike.length));
    });
  }

  like() {
    if (this.comment['like'].indexOf(this.username)!==-1) this.fServ.unlikeComment(this.comment['id'], 'comments', this.username); else {
      if (this.comment['dislike'].indexOf(this.username)!==-1) this.fServ.undislikeComment(this.comment['id'], 'comments', this.username);
      this.fServ.likeComment(this.comment['id'], 'comments', this.username);
    }
    
  }

  dislike() {
    if (this.comment['dislike'].indexOf(this.username)!==-1) this.fServ.undislikeComment(this.comment['id'], 'comments', this.username);
    else {
      if (this.comment['like'].indexOf(this.username)!==-1) this.fServ.unlikeComment(this.comment['id'], 'comments', this.username);
      this.fServ.dislikeComment(this.comment['id'], 'comments', this.username);
    }
  }

  e_reply = "";
  id_comment_re;
  id_comment;
  editinputValue = "";

  deleteReply() {
    this.fServ.deleteReply(this.id_movie, this.id_comment, this.id_comment_re);
    if (this.isLangThai) this._snackbar.open('ลบการตอบกลับเสร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Delete reply successfully!', 'Close');
  }

  get_edit(reply : string, comment_id : string, reply_id : string) {
    $('#collapseReply').collapse('hide');
    this.e_reply = reply;
    this.id_comment_re = reply_id;
    this.id_comment = comment_id;
    this.editinputValue = reply;
  }

  edit(event, reply : string) {
    if (reply != "") {
      if (event.keyCode == 13 || event.enter) {
        if (reply != this.e_reply) {
          $('#collapseEditR').collapse('hide');
          this.fServ.editReply(this.id_comment_re, 'replys', reply);
          this.editinputValue = null;
          if (this.isLangThai) this._snackbar.open('แก้ไขการตอบกลับเสร็จแล้ว!', 'ปิด');
          else this._snackbar.open('Edit reply successfully!', 'Close');
        } else {
          if (this.isLangThai) this._snackbar.open('การตอบกลับไม่มีการเปลี่ยนแปลง!', 'ปิด');
          else this._snackbar.open('Reply has not been change!', 'Close');
        }
      }
    }
    
  }
}