import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ThemeService } from '../theme.service';
import { LangService } from '../lang.service';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import * as firebase from 'firebase/app';

declare var require: any;

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '300px',
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

  genres = [
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

  isLoggedIn : boolean = false;
  username: string;

  submitted;
  loading;

  isDarkTheme;
  str_dark: string;

  postForm: FormGroup;

  link_str = "https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/home%2FNO_IMG_600x600.png?alt=media&token=86175650-a272-4a84-9bfd-8db745e5b139";

  list_genre = [];

  constructor(
    private storage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private lServ: LangService,
    private thServ: ThemeService,
    private fServ : FirebaseService,
    private route : Router,
    private firestore: AngularFirestore,
    private afAuth : AngularFireAuth,
    private auth : AuthService,
    private _snackbar: MatSnackBar
  ) { }

  isLangThai : boolean = false;
  op_lang;
  c_op_lang;
  u_lang;
  img_lang;
  review_lang;
  name_lang;
  r_name_lang;
  des_lang;
  r_des_lang;
  genre_lang;
  post_lang;
  clear_lang;

  notic_lang;
  notic2_lang;

  notic3_lang;

  choose_op = 1;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  imgURL: string;

  @ViewChild('fileInput') el: ElementRef;
  imageUrl: any = "https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/home%2FNO_IMG_600x600.png?alt=media&token=86175650-a272-4a84-9bfd-8db745e5b139";
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
      this.op_lang = "เลือกรูปแบบรูปวิจารย์";
      this.c_op_lang = "อัพโหลดรูปภาพ"
      this.u_lang = "อัพโหลดภาพ"
      this.img_lang = "ลิงค์รูป";
      this.review_lang = "เขียนบทวิจารย์หนังของคุณ";
      this.name_lang = "ชื่อหนัง";
      this.r_name_lang = "กรุณากรอกชื่อหนัง";
      this.des_lang = "การบรรยาย";
      this.r_des_lang = "กรุณากรอกการบรรยาย";
      this.genre_lang = "เพิ่มประเภท";
      this.post_lang = "ส่งบทวิจารย์";
      this.clear_lang = "ล้างข้อมูล";
      this.notic_lang = "สมาชิก VIP ";
      this.notic2_lang = "สามารถดูวิดีโอ Youtube จากชื่อหนังของคุณ";
      this.notic3_lang = "อุปกรณ์บางเครื่องไม่รองรับฟังก์ชั่นสี";
    } else {
      this.isLangThai = false;
      this.op_lang = "Choose options image review";
      this.c_op_lang = "Upload Image File"
      this.u_lang = "Upload Image"
      this.img_lang = "Image Link";
      this.review_lang = "Review Your Movie";
      this.name_lang = "Movie name";
      this.r_name_lang = "Movie name is required";
      this.des_lang = "Description";
      this.r_des_lang = "Description is required";
      this.genre_lang = "Add genre"
      this.post_lang = "Post review"
      this.clear_lang = "Clear data";
      this.notic_lang = "VIP member ";
      this.notic2_lang = "can watch Youtube videos from the name of your movie name.";
      this.notic3_lang = "Some devices not support the color function.";
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.op_lang = "เลือกรูปแบบรูปวิจารย์";
        this.c_op_lang = "อัพโหลดรูปภาพ"
        this.u_lang = "อัพโหลดภาพ"
        this.img_lang = "ลิงค์รูป";
        this.review_lang = "เขียนบทวิจารย์หนังของคุณ";
        this.name_lang = "ชื่อหนัง";
        this.r_name_lang = "กรุณากรอกชื่อหนัง";
        this.des_lang = "การบรรยาย";
        this.r_des_lang = "กรุณากรอกการบรรยาย";
        this.genre_lang = "เพิ่มประเภท"
        this.post_lang = "ส่งบทวิจารย์";
        this.clear_lang = "ล้างข้อมูล";
        this.notic_lang = "สมาชิก VIP ";
        this.notic2_lang = "สามารถดูวิดีโอ Youtube จากชื่อหนังของคุณ";
        this.notic3_lang = "อุปกรณ์บางเครื่องไม่รองรับฟังก์ชั่นสี";
      } else {
        this.isLangThai = false;
        this.op_lang = "Choose options image review";
        this.c_op_lang = "Upload Image File"
        this.u_lang = "Upload Image"
        this.img_lang = "Image Link";
        this.review_lang = "Review Your Movie";
        this.name_lang = "Movie name";
        this.r_name_lang = "Movie name is required";
        this.des_lang = "Description";
        this.r_des_lang = "Description is required";
        this.genre_lang = "Add genre"
        this.post_lang = "Post review"
        this.clear_lang = "Clear data";
        this.notic_lang = "VIP member ";
        this.notic2_lang = "can watch Youtube videos from the name of your movie name.";
        this.notic3_lang = "Some devices not support the color function.";
      }
    });
    this.postForm = this.formBuilder.group({
        name: ['', Validators.required],
        desc: ['', Validators.required]
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
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.username = user.displayName;
          this.isLoggedIn = true;
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
              }
            });
          }
        }
      );
  }

  get_link(link:string) {
    if (link != "") this.link_str = link;
    else this.link_str = "https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/home%2FNO_IMG_600x600.png?alt=media&token=86175650-a272-4a84-9bfd-8db745e5b139";
  }

  get f() { return this.postForm.controls; }

  onSubmitPost(text) {
    this.submitted = true;
    this.loading = true;

    // stop here if form is invalid
    if (this.postForm.invalid) {
      this.loading = false;
      return;
    }
    if (this.list_genre.length == 0) this.list_genre = ["Other"]

    const id = this.firestore.createId();

    if (this.choose_op == 1) {
      if (this.imageUrl == this.link_str) {
        let movie = {
          id: id,
          link: "https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/home%2FNO_IMG_600x600.png?alt=media&token=86175650-a272-4a84-9bfd-8db745e5b139",
          name: this.f.name.value,
          s_name: this.powerset(this.f.name.value),
          des: text,
          postBy: this.username,
          date: firebase.firestore.Timestamp.now(),
          genre: this.list_genre,
          view: 0,
          star: [],
          id_list: [],
          id_list_reply: [],
          id_his_des: [],
          id_his_gen: []
        };
        this.fServ.addData(id, 'movies', movie);
        if (this.isLangThai) this._snackbar.open('วิจารย์หนัง: '+this.f.name.value+' สำเร็จแล้ว!', 'ปิด');
        else this._snackbar.open('Review movie: '+this.f.name.value+' successfully!', 'Close');
        this.route.navigate(['']);
      } else {
        const path = `img_reviews/${Date.now()}_${this.imgName}`;
        const ref = this.storage.ref(path);
        this.task = this.storage.upload(path, this.imgfile);
        this.percentage = this.task.percentageChanges();
        this.snapshot = this.task.snapshotChanges().pipe(tap(), finalize(async() => {
          this.imgURL = await ref.getDownloadURL().toPromise();
          let movie = {
            id: id,
            link: this.imgURL,
            name: this.f.name.value,
            s_name: this.powerset(this.f.name.value),
            des: text,
            postBy: this.username,
            date: firebase.firestore.Timestamp.now(),
            genre: this.list_genre,
            view: 0,
            star: [],
            id_list: [],
            id_list_reply: [],
            id_his_des: [],
            id_his_gen: [],
            path
          };
          this.fServ.addData(id, 'movies', movie);
          if (this.isLangThai) this._snackbar.open('วิจารย์หนัง: '+this.f.name.value+' สำเร็จแล้ว!', 'ปิด');
          else this._snackbar.open('Review movie: '+this.f.name.value+' successfully!', 'Close');
          this.route.navigate(['']);
        }));
      }
    } else {
      if (this.link_str == "") {
        let movie = {
          id: id,
          link: "https://firebasestorage.googleapis.com/v0/b/moviereview-cmu.appspot.com/o/home%2FNO_IMG_600x600.png?alt=media&token=86175650-a272-4a84-9bfd-8db745e5b139",
          name: this.f.name.value,
          s_name: this.powerset(this.f.name.value),
          des: text,
          postBy: this.username,
          date: firebase.firestore.Timestamp.now(),
          genre: this.list_genre,
          view: 0,
          star: [],
          id_list: [],
          id_list_reply: [],
          id_his_des: [],
          id_his_gen: []
        };
        this.fServ.addData(id, 'movies', movie);
      } else {
        let movie = {
          id: id,
          link: this.link_str,
          name: this.f.name.value,
          s_name: this.powerset(this.f.name.value),
          des: text,
          postBy: this.username,
          date: firebase.firestore.Timestamp.now(),
          genre: this.list_genre,
          view: 0,
          star: [],
          id_list: [],
          id_list_reply: [],
          id_his_des: [],
          id_his_gen: []
        };
        this.fServ.addData(id, 'movies', movie);
      }
      if (this.isLangThai) this._snackbar.open('วิจารย์หนัง: '+this.f.name.value+' สำเร็จแล้ว!', 'ปิด');
      else this._snackbar.open('Review movie: '+this.f.name.value+' successfully!', 'Close');
      this.route.navigate(['']);
    }
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

  powerset(str) {
    const arr = [];
    let list_items = str.toLowerCase().split(" ").join("").split('');
    list_items.forEach(letter => {
      let startName = "";
      list_items.forEach(text => {
        startName += text;
        if (arr.indexOf(startName)===-1) arr.push(startName);
      });
      list_items = str.toLowerCase().split(" ").join("").replace(new RegExp(letter), '').split('');
      str = list_items.join("");
    });
    return arr;
  }

  clearText() {
    this.postForm.reset();
    this.list_genre = [];
  }

  changeOption() {
    if ($('#upload').is(":checked")) this.choose_op = 1;
    if ($('#linkurl').is(":checked")) this.choose_op = 2;
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}