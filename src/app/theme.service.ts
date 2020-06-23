import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable(
  {providedIn:"root"}
)
export class ThemeService {

  public isDarkTheme = new Subject<boolean>();
  private callThemeSource = new Subject<any>();

  callTheme = this.callThemeSource.asObservable();

  darktheme() {
    localStorage.setItem('isDarkTheme', "true");
    this.isDarkTheme.next(true);
  }

  lighttheme() {
    localStorage.setItem('isDarkTheme', 'false');
    this.isDarkTheme.next(false);
  }

  refreshTheme() {
    this.callThemeSource.next();
  }

  constructor() { }

}