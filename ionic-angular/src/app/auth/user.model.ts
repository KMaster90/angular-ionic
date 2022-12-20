export class UserModel{
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    public _tokenExpirationDate: Date,
  ) {}

  get token() {
    // eslint-disable-next-line no-underscore-dangle
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    // eslint-disable-next-line no-underscore-dangle
    return this._token;
  }

  get tokenDuration() {
    if (!this.token){
      return 0;
    }
    // eslint-disable-next-line no-underscore-dangle
    return this._tokenExpirationDate.getTime() - new Date().getTime();
  }
}
