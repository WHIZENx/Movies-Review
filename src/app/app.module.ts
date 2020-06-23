import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgCircleProgressModule } from 'ng-circle-progress'

import { TimeAgoPipe } from 'time-ago-pipe';
import { TimeAgoThaiPipe } from './time-ago-thai.pipe';
import { TimeFuturePipe } from './time-future.pipe';
import { TimeFutureThaiPipe } from './time-future-thai.pipe';
import { NumberSuffixesPipe } from './number-suffix.pipe';
import { SafePipe } from './safe.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from './environment';

import { AuthGuard } from './auth.guard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app.material.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ThemeService } from './theme.service';
import { LoginComponent } from './login/login.component';
import { FirebaseService } from './firebase.service';
import { DisplayMovieComponent } from './display-movie/display-movie.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { RegisterComponent } from './register/register.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { DisplayCommentComponent } from './display-comment/display-comment.component';
import { DisplayReplyComponent } from './display-reply/display-reply.component';
import { DisplayHistoryDesComponent } from './display-history-des/display-history-des.component';
import { DisplayHistoryGenComponent } from './display-history-gen/display-history-gen.component';
import { LangService } from './lang.service';
import { YoutubeService } from './youtube.service';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  imports: [ BrowserModule,
  ReactiveFormsModule,
  FormsModule,
  NgCircleProgressModule.forRoot({}),
  RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'review', component: AddMovieComponent, canActivate:[AuthGuard] },
      { path: 'profile/:userName', component: ProfileComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'movies/:movieId', component: MovieDetailComponent },
      { path: '**', component: NotFoundComponent }
  ]), 
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireDatabaseModule,
  AngularFireAuthModule,
  AngularFireStorageModule,
  BrowserAnimationsModule,
  AppMaterialModule,
  HttpClientModule,
  AngularEditorModule
  ],
  declarations: [ AppComponent, HomeComponent, HeaderComponent, LoginComponent, DisplayMovieComponent, TimeAgoPipe, TimeAgoThaiPipe, AddMovieComponent, MovieDetailComponent, RegisterComponent, NumberSuffixesPipe, NotFoundComponent, ProfileComponent, AdminComponent, DisplayCommentComponent, DisplayReplyComponent, DisplayHistoryDesComponent, DisplayHistoryGenComponent, SafePipe, TimeFuturePipe, TimeFutureThaiPipe, SafeHtmlPipe ],
  bootstrap:    [ AppComponent ],
  providers: [ ThemeService, AngularFirestore, FirebaseService, AuthGuard, LangService, YoutubeService ]
})
export class AppModule { }
