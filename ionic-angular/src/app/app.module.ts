import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {environment} from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AuthInterceptorService} from './auth/auth-interceptor.service';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, IonicModule.forRoot(), AppRoutingModule, AngularFireModule.initializeApp(environment.firebaseConfig),AngularFireAuthModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
