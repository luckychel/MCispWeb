import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/share';
import { ApiProvider } from '../../providers/api/api';

@Injectable()
export class UserProvider {

  _user : { login: string, password: string, isAuth: boolean, authError: string, isRemember: boolean, molId: string, molName: string,molPhoto: string, registrationId: string, serverToken: string } = {
    login: "",
    password: "",
    isAuth: false,
    authError: "",
    isRemember: false,
    molId: "",
    molName: "",
    molPhoto: "",
    registrationId: "",
    serverToken: ""
  };
  
  constructor(public http: Http, public api: ApiProvider) {
    
  }

  
  login(accountInfo: any) {
    return this.api.post('auth/newLogin', accountInfo)
      .map(res => {
        return res.json();
      });
  }
}
