import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { YoutubeService } from '../youtube.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as firebase from 'firebase/app';

import { CircleProgressComponent, CircleProgressOptions } from 'ng-circle-progress';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '200px',
    maxHeight: 'auto',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'bookman', name: 'Bookman'},
      {class: 'candara', name: 'Candara'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'},
      {class: 'courier-new', name: 'Courier New'},
      {class: 'garamond', name: 'Garamond'},
      {class: 'georgia', name: 'Georgia'},
      {class: 'impact', name: 'Impact'},
      {class: 'tahoma', name: 'Tahoma'},
      {class: 'times', name: 'Times'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'verdana', name: 'Verdana'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertImage'],
    ]
  };

  editForm: FormGroup;
  success = false;
  edit_submitted = false;

  isVip = false;

  all_genres = [
    "Action",
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
    "Other"
  ]

  edit_list_genre : string[];

  isLoggedIn : boolean = false;
  isOwn : boolean = false;
  f_search : boolean = false;

  isDarkTheme;
  str_dark: string;

  id_url : string;
  username : string;

  genres : string[];
  curr_user;
  user;
  comment;

  history_des;
  history_gen;
  history = "des";

  avg_star : number = 0;
  save_avg : number = 0;
  number_rate : number;
  num_star = new Array();

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;
  selectOdd: number = 0;

  constructor(
    private storage: AngularFireStorage,
    private yServ: YoutubeService,
    private lServ: LangService,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private route : Router,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore,
    private afAuth : AngularFireAuth,
    private auth : AuthService,
    private _snackbar: MatSnackBar
  ) {
    this.id_url = this.route.url.split('/')[2];
  }
  map_photo;

  user_status;
  user_level;

  isLangThai : boolean = false;
  options_lang;

  edit_lang;
  e_title_lang;
  e_des_lang;
  r_des_lang;
  e_genre;
  error_lang;

  close_lang;
  save_lang;

  his_lang;
  his_d_lang;
  his_g_lang;
  delete_lang;
  title_lang;
  no_lang;
  yes_lang;

  cheer_rate_lang;
  over_lang;
  review_lang;
  rating_lang;
  cheer_lang;
  view_lang;
  reviewdate_lang;
  genre_lang;
  comment_lang;

  notfound_lang;
  back_lang;

  notic3_lang;

  y1_lang;
  y2_lang;

  embed_youtube;
  star_percent = 0;

  text_progress;

  ngOnInit() {
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.options_lang = "ตัวเลือก";
      this.edit_lang = "แก้ไขบทวิจารย์";
      this.e_title_lang = "แก้ไขบทวิจารย์";
      this.e_des_lang = "แก้ไขการบรรยาย";
      this.r_des_lang = "กรุณากรอกการบรรยาย";
      this.e_genre = "แก้ไขประเภท";
      this.error_lang = "คำอธิบายและประเภทไม่มีการเปลี่ยนแปลง! กรุณาลองอีกครั้ง.";
      this.close_lang = "ปิด";
      this.save_lang = "บันทึกการเปลี่ยนแปลง";
      this.his_lang = "ดูประวัติการแก้ไข";
      this.his_d_lang = "ประวัติของคำอธิบาย";
      this.his_g_lang = "ประวัติของประเภท";
      this.delete_lang = "ลบบทวิจารย์";
      this.title_lang = "บทวิจารย์นี้จะถูกลบอย่างถาวร";
      this.no_lang = "ไม่";
      this.yes_lang = "ใช่";
      this.cheer_rate_lang = "ให้คะแนนเชียร์";
      this.over_lang = "ต้องเป็นสมาชิก Gold ขึ้นไปเท่านั้น";
      this.review_lang = "วิจารย์โดย";
      this.rating_lang = "คะแนน";
      this.cheer_lang = "เชียร์";
      this.view_lang = "ยอดดู";
      this.reviewdate_lang = "วิจารย์เมื่อ";
      this.genre_lang = "ประเภท";
      this.comment_lang = "ความคิดเห็น";
      this.notfound_lang = "ขออภัย แต่บทวิจารย์ที่คุณกำลังค้นหาไม่มีอยู่ หรือ บทวิจารย์ได้ถูกลบไปแล้ว";
      this.back_lang = "กลับหน้าหลัก";
      this.y1_lang = "คุณเป็น";
      this.y2_lang = "คลิกที่นี่เพื่อดูหนังนี้";
      this.notic3_lang = "อุปกรณ์บางเครื่องไม่รองรับฟังก์ชั่นสี";
    } else {
      this.isLangThai = false;
      this.options_lang = "Options";
      this.edit_lang = "Edit review";
      this.e_title_lang = "Edit review";
      this.e_des_lang = "Edit Description";
      this.r_des_lang = "Description is required";
      this.e_genre = "Edit Genre";
      this.error_lang = "Description and Genre has not been changed! Please try again.";
      this.close_lang = "Close";
      this.save_lang = "Save changes";
      this.his_lang = "View edit history";
      this.his_d_lang = "History of Description";
      this.his_g_lang = "History of Genre";
      this.delete_lang = "Delete review";
      this.title_lang = "This review will be deleted permanently";
      this.no_lang = "No";
      this.yes_lang = "Yes";
      this.cheer_rate_lang = "Give cheer rating";
      this.over_lang = "Must be over Gold Member";
      this.review_lang = "Review by";
      this.rating_lang = "Rating";
      this.cheer_lang = "Cheers";
      this.view_lang = "Views";
      this.reviewdate_lang = "Review date";
      this.genre_lang = "Genre";
      this.comment_lang = "Comments";
      this.notfound_lang = "We are sorry but the review you are looking for does not exits or the review has been deleted.";
      this.back_lang = "Go back home";
      this.y1_lang = "You are";
      this.y2_lang = "click here to see movie.";
      this.notic3_lang = "Some devices not support the color function.";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.options_lang = "ตัวเลือก";
        this.edit_lang = "แก้ไขบทวิจารย์";
        this.e_title_lang = "แก้ไขบทวิจารย์";
        this.e_des_lang = "แก้ไขการบรรยาย";
        this.r_des_lang = "กรุณากรอกการบรรยาย";
        this.e_genre = "แก้ไขประเภท";
        this.error_lang = "คำอธิบายและประเภทไม่มีการเปลี่ยนแปลง! กรุณาลองอีกครั้ง.";
        this.close_lang = "ปิด";
        this.save_lang = "บันทึกการเปลี่ยนแปลง";
        this.his_lang = "ดูประวัติการแก้ไข";
        this.his_d_lang = "ประวัติของคำอธิบาย";
        this.his_g_lang = "ประวัติของประเภท";
        this.delete_lang = "ลบบทวิจารย์";
        this.title_lang = "บทวิจารย์นี้จะถูกลบอย่างถาวร";
        this.no_lang = "ไม่";
        this.yes_lang = "ใช่";
        this.cheer_rate_lang = "ให้คะแนนเชียร์";
        this.over_lang = "ต้องเป็นสมาชิก Gold ขึ้นไปเท่านั้น";
        this.review_lang = "วิจารย์โดย";
        this.rating_lang = "คะแนน";
        this.cheer_lang = "เชียร์";
        this.view_lang = "ยอดดู";
        this.reviewdate_lang = "วิจารย์เมื่อ";
        this.genre_lang = "ประเภท";
        this.comment_lang = "ความคิดเห็น";
        this.notfound_lang = "ขออภัย แต่บทวิจารย์ที่คุณกำลังค้นหาไม่มีอยู่ หรือ บทวิจารย์ได้ถูกลบไปแล้ว";
        this.back_lang = "กลับหน้าหลัก";
        this.y1_lang = "คุณเป็น";
        this.y2_lang = "คลิกที่นี่เพื่อดูหนังนี้";
        this.notic3_lang = "อุปกรณ์บางเครื่องไม่รองรับฟังก์ชั่นสี";
      } else {
        this.isLangThai = false;
        this.options_lang = "Options";
        this.edit_lang = "Edit review";
        this.e_title_lang = "Edit review";
        this.e_des_lang = "Edit Description";
        this.r_des_lang = "Description is required";
        this.e_genre = "Edit Genre";
        this.error_lang = "Description and Genre has not been changed! Please try again.";
        this.close_lang = "Close";
        this.save_lang = "Save changes";
        this.his_lang = "View edit history";
        this.his_d_lang = "History of Description";
        this.his_g_lang = "History of Genre";
        this.delete_lang = "Delete review";
        this.title_lang = "This review will be deleted permanently";
        this.no_lang = "No";
        this.yes_lang = "Yes";
        this.cheer_rate_lang = "Give cheer rating";
        this.over_lang = "Must be over Gold Member";
        this.review_lang = "Review by";
        this.rating_lang = "Rating";
        this.cheer_lang = "Cheers";
        this.view_lang = "Views";
        this.reviewdate_lang = "Review date";
        this.genre_lang = "Genre";
        this.comment_lang = "Comments";
        this.notfound_lang = "We are sorry but the review you are looking for does not exits or the review has been deleted.";
        this.back_lang = "Go back home";
        this.y1_lang = "You are";
        this.y2_lang = "click here to see movie.";
        this.notic3_lang = "Some devices not support the color function.";
      }
    });
    this.editForm = this.formBuilder.group({
      edit_des: ['', Validators.required]
    });
    this.thServ.isDarkTheme.subscribe(val => this.isDarkTheme = val);
    if (localStorage.getItem("isDarkTheme")==="true") {
      this.isDarkTheme = true;
      this.str_dark = "dark";
      this.text_progress = "#ffffff";
    } else {
      this.isDarkTheme = false;
      this.str_dark = "light";
      this.text_progress = "#000000";
    }
    this.thServ.callTheme.subscribe(
      () => {
        this.thServ.isDarkTheme.subscribe(val => this.isDarkTheme = val);
        if (localStorage.getItem("isDarkTheme")==="true") {
          this.isDarkTheme = true;
          this.str_dark = "dark";
          this.text_progress = "#ffffff";
        } else {
          this.isDarkTheme = false;
          this.str_dark = "light";
          this.text_progress = "#000000";
        }
      }
    );
    this.fServ.getData(this.id_url, 'movies').subscribe(val => {
      this.num_star = new Array();
        this.movie = val.map( e => {
          this.fServ.getUser(e.payload.doc.data()['postBy'], 'users').subscribe( v=> {
            this.user = v.map( e2 => {
              return {
                id: e2.payload.doc.id,
                ...e2.payload.doc.data()
                }
              })
            });
          this.genres = e.payload.doc.data()['genre'];
          this.number_rate = e.payload.doc.data()['star'].length;
          let sum_star = 0;
          if (e.payload.doc.data()['postBy'] == this.username) this.isOwn = true;
          e.payload.doc.data()['star'].forEach(obj => {
            let array = obj.split(':')
            sum_star += parseInt(array[1]);
            if (array[0] == this.username) {
              this.selectedValue = array[1];
              this.selectOdd = this.selectedValue;
            }
          });
          if (this.number_rate!=0) {
            this.avg_star = sum_star/this.number_rate;
            this.save_avg = this.avg_star;
          } else {
            this.save_avg = 0;
          }
          
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
          this.star_percent = (this.avg_star.toFixed(1)/5)*100;
      });
    this.auth.isLoggedIn.subscribe(val => this.isLoggedIn = val);
    if (localStorage.getItem("isLoggedIn")==="true") {
      this.isLoggedIn = true;
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.displayName;
          this.isLoggedIn = true;
          this.fServ.getUser(user.displayName, 'users').subscribe( v=> {
          this.curr_user = v.map( e => {
            this.user_status = e.payload.doc.data()['status'];
            this.user_level = e.payload.doc.data()['level'];
            this.isVip = e.payload.doc.data()['vip'];
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
                this.fServ.getUser(user.displayName, 'users').subscribe( v => {
                this.curr_user = v.map( e => {
                   this.user_status = e.payload.doc.data()['status'];
                   this.user_level = e.payload.doc.data()['level'];
                   this.isVip = e.payload.doc.data()['vip'];
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
    this.fServ.getComments(this.id_url ,'comments').subscribe(val => {
      this.comment = val.map( e => {
         return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
      }).sort((b,a) => (a.like.length-a.dislike.length)-(b.like.length-b.dislike.length));
    });
    this.fServ.getHisDes(this.id_url ,'history_des').subscribe(val => {
      this.history_des = val.map( e => {
         return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
      });
    });
    this.fServ.getHisDes(this.id_url ,'history_gen').subscribe(val => {
      this.history_gen = val.map( e => {
         return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
      });
    });
  }

  errorstar(login, status, level) {
    if (!login) {
      if (this.isLangThai) this._snackbar.open('กรุณาล็อกอินก่อนโหวตคะแนน!', 'ปิด');
      else this._snackbar.open('Please Login first for voting!', 'ปิด');
    } else if (status == 'Ban') {
      if (this.isLangThai) this._snackbar.open('คุณถูกแบนอยู่ จึงไม่สามารถโหวตคะแนนได้!', 'ปิด');
      else this._snackbar.open('You are banned, Unable to vote!', 'ปิด');
    } else if (level == 'Normal') {
      if (this.isLangThai) this._snackbar.open('คุณอยู่ระดับ Normal คุณจำเป็นต้องซื้อระดับ Gold ขึ้นไป!', 'ปิด');
      else this._snackbar.open('You are Normal level. You need to buy Gold level or higher!', 'ปิด');
    }
  }

  saveStar(num : number) {
    if (num != this.selectOdd) {
      let arrayOld = this.username+":"+this.selectOdd;
      this.fServ.removeStar(this.id_url, 'movies', arrayOld);
      this.fServ.rateStar(this.id_url, 'movies', this.username, num);
      this.selectOdd = this.selectedValue;
    }
  }

  countStar(star) {
    this.selectedValue = star;
  }

  loadStar() {
    this.selectedValue = this.selectOdd;
  }

  m_id_list = [];
  m_id_list_reply = [];
  m_id_list_his_des = [];
  m_id_list_his_gen = [];
  m_path;

  get_delete(id_list, id_list_reply, id_list_his_des, id_list_his_gen, path) {
    this.m_id_list = id_list;
    this.m_id_list_reply = id_list_reply;
    this.m_id_list_his_des = id_list_his_des;
    this.m_id_list_his_gen = id_list_his_gen;
    this.m_path = path;
  }

  deleteReview() {
    this.m_id_list_reply.forEach(obj => {
      this.fServ.deleteData(obj, 'replys');
    });
    this.m_id_list.forEach(obj => {
      this.fServ.deleteData(obj, 'comments');
    });
    this.m_id_list_his_des.forEach(obj => {
      this.fServ.deleteData(obj, 'history_des');
    });
    this.m_id_list_his_gen.forEach(obj => {
      this.fServ.deleteData(obj, 'history_gen');
    });
    this.fServ.deleteData(this.id_url, 'movies');
    if (this.m_path!==undefined) this.storage.ref('img_reviews').child(this.m_path.split('/')[1]).delete();
    if (this.isLangThai) this._snackbar.open('ลบบทวิจารย์นี้สำเร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Delete review successfully!', 'Close');
    this.route.navigate(['']);
  }

  isEmpty(movie) {
    if(movie!==undefined) return movie.length == 0;
  }

  goback() {
    this.route.navigate(['']);
  }

  get e() { return this.editForm.controls; }
  htmlContent = "";
  old_content = ""

  Editreview(des : string, array_genre) {
    this.edit_submitted = false;
    this.success = false;
    this.htmlContent = des;
    this.old_content = des;
    this.edit_list_genre = array_genre;
  }

  addGenre(list_genre, genre:string) {
    if(list_genre.indexOf(genre) == -1) {
      list_genre.push(genre);
    }
  }

  deleteGenre(list_genre, genre:string) {
    const index: number = list_genre.indexOf(genre);
    if (index !== -1) {
        list_genre.splice(index, 1);
    }
  }

  onSubmit(id : string, des : string) {
    this.edit_submitted = true;
    if (this.editForm.invalid || des == this.old_content && this.genres.join(' ') == this.edit_list_genre.join(' ')) {
      this.success = false;
      return;
    }
    const id_des = this.firestore.createId();
    const id_gen = this.firestore.createId();
    if (des != this.old_content && this.genres.join(' ') == this.edit_list_genre.join(' ')) {
      this.fServ.saveHisDes(id_des, 'history_des', this.id_url, this.old_content);
      this.fServ.addListHisDes(id, 'movies', id_des);
    } else if (des == this.old_content && this.genres.join(' ') != this.edit_list_genre.join(' ')) {
      this.fServ.saveHisGen(id_gen, 'history_gen', this.id_url, this.genres);
      this.fServ.addListHisGen(id, 'movies', id_gen);
    } else if (des != this.old_content && this.genres.join(' ') != this.edit_list_genre.join(' ')) {
      this.fServ.saveHisDes(id_des, 'history_des', this.id_url, this.old_content);
      this.fServ.saveHisGen(id_gen, 'history_gen', this.id_url, this.genres);
      this.fServ.addListHisDes(id, 'movies', id_des);
      this.fServ.addListHisGen(id, 'movies', id_gen);
    }

    this.fServ.updateReview(id, 'movies', des, this.edit_list_genre);
    this.success = true;
    this.edit_submitted = false;
    if (this.isLangThai) this._snackbar.open('แก้ไขบทวิจารย์นี้สำเร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Edit review successfully!', 'Close');
  }

  inputValue = "";
  replyinputValue = ""
  editinputValue = "";

  addcomment(event, comment, photo) {
    if (event.keyCode == 13 || event.enter) {
      if (comment == "") return;

      const id = this.firestore.createId();
      let data = {
        id_com: this.id_url,
        id: id,
        user: this.username,
        comment: comment,
        date: firebase.firestore.Timestamp.now(),
        photo: photo,
        like: [],
        dislike: [],
        id_list: [],
        edit: false
      };
      this.fServ.addList(this.id_url, 'movies', id);
      this.fServ.addComment(id, 'comments', data);
      this.inputValue = null;
      if (this.isLangThai) this._snackbar.open('แสดงความคิดเห็นบทวิจารย์นี้สำเร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Comment review successfully!', 'Close');
    }
  }

  e_comment = "";
  id_comment;

  get_edit(comment : string, id : string) {
    $('#collapseReply').collapse('hide');
    this.e_comment = comment;
    this.id_comment = id;
    this.editinputValue = comment;
  }

  deleteComment(id_list) {
    id_list.forEach(obj => {
      this.fServ.deleteReply(this.id_url, this.id_comment, obj);
    })
    this.fServ.deleteComment(this.id_url, this.id_comment, id_list);
    if (this.isLangThai) this._snackbar.open('ลบความคิดเห็นบทวิจารย์นี้สำเร็จแล้ว!', 'ปิด');
    else this._snackbar.open('Delete Comment review successfully!', 'Close');
  }

  edit(event, comment : string) {
    if (comment != "") {
      if (event.keyCode == 13 || event.enter) {
        if (comment != this.e_comment) {
          $('#collapseEdit').collapse('hide');
          this.fServ.editComment(this.id_comment, 'comments', comment);
          this.editinputValue = null;
          if (this.isLangThai) this._snackbar.open('แก้ไขความคิดเห็นบทวิจารย์นี้สำเร็จแล้ว!', 'ปิด');
          else this._snackbar.open('Edit comment successfully!', 'Close');
          
          
        } else {
          if (this.isLangThai) this._snackbar.open('ความคิดเห็นไม่มีการเปลี่ยนแปลง!', 'ปิด');
          else this._snackbar.open('Comment has not been change!', 'Close');
        }
      }
    }
  }

  get_reply(id : string) {
    $('#collapseEdit').collapse('hide');
    this.id_comment = id;
    this.replyinputValue = null;
  }

  addreply(event, reply, photo) {
    if (event.keyCode == 13 || event.enter) {
      if (reply == "") return;

      const id = this.firestore.createId();
      let data = {
        id_com_re: this.id_comment,
        id: id,
        user: this.username,
        reply: reply,
        date: firebase.firestore.Timestamp.now(),
        photo: photo,
        like: [],
        dislike: []
      };
      this.fServ.addList(this.id_comment, 'comments', id);
      this.fServ.addListReply(this.id_url, 'movies', id);
      this.fServ.addReply(id, 'replys', data);
      $('#collapseReply').collapse('hide');
      this.replyinputValue = null;
      if (this.isLangThai) this._snackbar.open('ตอบกลับสำเร็จแล้ว!', 'ปิด');
      else this._snackbar.open('Reply successfully!', 'Close');
    }
  }

  mode_movie = false;
  closeMovie() {
    this.mode_movie = true;
  }

  finish_load = false;
  search_youtube(name) {
    if (!this.f_search) {
      this.yServ.search(name).subscribe(url => {
        this.embed_youtube = "https://www.youtube.com/embed/"+url[0];
        this.finish_load = true;
      });
      this.f_search = true;
    }
  }

  changeHis(his) {
    switch (his.index) {
      case 0: this.history = "des"; break;
      case 1: this.history = "gen"; break;
    }
  }

}