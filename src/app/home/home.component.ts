import { ViewEncapsulation, Component, OnInit } from '@angular/core';
import { LangService } from '../lang.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseService } from '../firebase.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading = false;
  genre_now = "All";
  genres = [
    "All",
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

  genres_thai = [
    "ทั้งหมด",
    "หนังบู๊",
    "หนังอนิเมชั่น",
    "หนังตลก",
    "หนังอาชญากรรม",
    "ละคร",
    "หนังการทดลอง",
    "หนังแฟนตาซี",
    "หนังประวัติศาสตร์",
    "หนังผี",
    "หนังวิทยาศาสตร์",
    "หนังตื่นเต้น",
    "หนังตะวันตก",
    "หนังดนตรี",
    "หนังสงคราม",
    "หนังอื่นๆ"
  ]

  movies;
  movies_genre;
  hot_movie;

  sum_movie = 0;

  constructor(
    private lServ: LangService,
    private fServ : FirebaseService,
    private firestore: AngularFirestore
  ) { 
  }

  isLangThai : boolean = false;
  search_lang;
  result_lang;
  hot_lang;

  ngOnInit() {
    window.scrollTo(0, 0);
    if (localStorage.getItem("isLangThai")==="true") {
      this.isLangThai = true;
      this.search_lang = "ค้นหาหนัง"
      this.result_lang = "ผลลัพท์ของบทวิจารย์"
      this.hot_lang = "บทวิจารย์มาแรงโดย"
    } else {
      this.isLangThai = false;
      this.search_lang = "Search Movie"
      this.result_lang = "Result number of reviews"
      this.hot_lang = "Hot review by"
    }
    this.lServ.callLang.subscribe(() => {
      if (localStorage.getItem("isLangThai")==="true") {
        this.isLangThai = true;
        this.search_lang = "ค้นหาหนัง"
        this.result_lang = "ผลลัพท์ของบทวิจารย์"
        this.hot_lang = "บทวิจารย์มาแรงโดย"
      } else {
        this.isLangThai = false;
        this.search_lang = "Search Movie"
        this.result_lang = "Result number of reviews"
        this.hot_lang = "Hot review by"
      }
    });
    
    this.fServ.getDatas('movies').subscribe(val => {
      this.movies = val.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
        })
        this.loading = true;
    });
    this.fServ.getHotmovie('movies').subscribe(val => {
      this.hot_movie = val.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
        });
        this.loading = true;
    });
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

  search($event, movies) {
    let q = $event.target.value.toLowerCase().split(" ").join("");
    var char = [20, 16, 17, 18, 13, 37, 38, 39, 40, 35, 36, 33, 34, 45, 44]
    if (char.indexOf($event.keyCode) === -1) {
      if (q != '') {
        this.fServ.searchData(q, 'movies').subscribe(val => {
          this.movies = val.map( e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
              }
            })
        });
      }
    }
    if (q == '' && char.indexOf($event.keyCode) === -1) {
      this.fServ.getDatas('movies').subscribe(val => {
        this.movies = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      });
    } 
  }

  selectGenre(genre) {
    this.genre_now = this.genres[genre.index];
    if (genre.index == 0) {
        this.fServ.getDatas('movies').subscribe(val => {
          this.movies = val.map( e => {
            return {
              id: e.payload.doc.id,
              ...e.payload.doc.data()
            }
          })
        });
    } else {
      this.fServ.selectGenre(this.genre_now, 'movies').subscribe(val => {
        this.movies = val.map( e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
            }
          })
      });
      this.getMovieGenre(this.genre_now);
    }
  }

  isEmpty(obj) {
    if (obj === undefined) return true;
    return Object.keys(obj).length == 0;
  }

  getMovieGenre(genre) {
    this.fServ.selectGenre(genre, 'movies').subscribe(val => {
      this.movies_genre = val.map( e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
          }
        })
    });
  }

  countItem(movie) {
    if(movie !==undefined) this.sum_movie = movie.length;
    return true;
  }

  incView(id : string) {
    this.fServ.upView(id, 'movies');
  }
}