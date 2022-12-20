import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {BehaviorSubject, from, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {UserModel} from './user.model';
import firebase from 'firebase/compat';
import {Preferences} from '@capacitor/preferences';
import UserCredential = firebase.auth.UserCredential;


@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<UserModel>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
  }

  get userId() {
    const {_user} = this;
    return _user.asObservable().pipe(map(user => user?.id || null));
  }
  get token() {
    const {_user} = this;
    return _user.asObservable().pipe(map(user => user?.token || null));
  }

  get userIsAuthenticated() {
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    return this._user.asObservable().pipe(map(user => !!user?.token ||  !!user?._token || null));
  }

  signup(email: string, password: string) {
    return from(this.afAuth.createUserWithEmailAndPassword(email, password)).pipe(a => {
        console.log(a);
        return a;
      },
      this.setUserDataPipe);
  }

  autoLogin() {
    return from(Preferences.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData?.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          email: string;
          token: string;
          tokenExpirationDate: string;
        };
        // const expirationTime = new Date(parsedData.tokenExpirationDate);
        // if (expirationTime <= new Date()) {
        //   return null;
        // }
        return new UserModel(parsedData.userId, parsedData.email, parsedData.token, new Date(parsedData.tokenExpirationDate));
      }),
      tap(user => {
        if (user) {
          // eslint-disable-next-line no-underscore-dangle
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => !!user)
    );
  }

  login(email, password) {
    // eslint-disable-next-line no-underscore-dangle
    return from(this.afAuth.signInWithEmailAndPassword(email, password)).pipe(this.setUserDataPipe);
  }

  autoLogout(tokenDuration: number) {
    console.log('tokenDuration', tokenDuration);
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, tokenDuration);
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.afAuth.signOut()
      .then(async () => {
        // eslint-disable-next-line no-underscore-dangle
        this._user.next(null);
        await Preferences.remove({key: 'authData'});
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }


  ngOnDestroy(): void {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }

  }

  private readonly setUserDataPipe = (origin: Observable<UserCredential>): Observable<void> => origin.pipe(map((user) => {
    // @ts-ignore
    const {user: {uid, email: userEmail, refreshToken, multiFactor:{user:{stsTokenManager: {expirationTime}}}}} = user;
    const userModel = new UserModel(uid, userEmail, refreshToken, new Date(expirationTime));
    // eslint-disable-next-line no-underscore-dangle
    this._user.next(userModel);
    // eslint-disable-next-line no-underscore-dangle
    this.autoLogout(userModel.tokenDuration);
    this.storeAuthData(uid, userEmail, refreshToken, new Date(expirationTime));
  }));

  private async storeAuthData(userId: string, userEmail: string, token: string, tokenExpirationDate: Date) {
    const data = JSON.stringify({
      userId,
      email: userEmail,
      _token:token,
      _tokenExpirationDate: tokenExpirationDate.toISOString()
    });
    await Preferences.set({key: 'authData', value: data});
  }
}
