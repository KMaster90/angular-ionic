import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;
  constructor() {}
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
