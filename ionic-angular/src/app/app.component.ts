import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@capacitor/splash-screen';
import {Capacitor, Plugins} from '@capacitor/core';
import {Subscription} from 'rxjs';
import {App, AppState} from '@capacitor/app';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  private previousAuthState = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        SplashScreen.hide();
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  ngOnInit(): void {
    this.sub = this.authService.userIsAuthenticated.subscribe(isAuthenticated => {
      if (!isAuthenticated && this.previousAuthState !== isAuthenticated) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuthenticated;
    });
    App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            this.onLogout();
          }
        });
    }
  }
}
