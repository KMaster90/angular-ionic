import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;
  // private _userId = 'abc';
  private _userId = 'xyz';

  constructor() {
  }

  get userId() {
    const {_userId} = this;
    return _userId;
  }

  get userIsAuthenticated() {
    const {_userIsAuthenticated} = this;
    return _userIsAuthenticated;
  }

  set userIsAuthenticated(value) {
    // eslint-disable-next-line no-underscore-dangle
    this._userIsAuthenticated = value;
  }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
