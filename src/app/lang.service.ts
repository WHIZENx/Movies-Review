import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class LangService {

  public isLangThai = new Subject<boolean>();
  private callLangSource = new Subject<any>();

  callLang = this.callLangSource.asObservable();

  langThai() {
    localStorage.setItem('isLangThai', "true");
    this.isLangThai.next(true);
  }

  langEng() {
    localStorage.setItem('isLangThai', 'false');
    this.isLangThai.next(false);
  }

  refreshLang() {
    this.callLangSource.next();
  }

  constructor() { }

}