import {Component, OnInit} from '@angular/core';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
  }

  authSuccess() {
    this.isLoading = true;
    this.loadingController.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/discover');
      }, 1500);
    }).catch(error => console.log(error));
  }

  onLogin(email: string, password: string) {
    this.authService.login(email, password)
      .subscribe(
        () => this.authSuccess(),
        (error) => this.alertController.create({message: error.message}).then(alertEl => alertEl.present())
      );
  }

  onSignup(email: string, password: string) {
    this.authService.signup(email, password)
      .subscribe(
        () => this.authSuccess(),
        (error) => this.alertController.create({message: error.message}).then(alertEl => alertEl.present())
      );
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const {email, password} = form.value;
    console.log(email, password);
    if (this.isLogin) {
      this.onLogin(email, password);
    } else {
      this.onSignup(email, password);
    }
    console.log(form.value);
  }
}
