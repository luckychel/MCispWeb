import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import { ApiProvider } from '../providers/api/api';
import { DbProvider } from '../providers/db/db';
import { UserProvider } from '../providers/user/user';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage: any = null;
  _user : any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private api: ApiProvider, private db: DbProvider, private user: UserProvider) {

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      this._user = user._user;
      this.getDbData().then((res)=>{
        if (res)
        {
          console.log("serverToken: " + this._user.serverToken);
          if (this._user.serverToken !== "")
          {
            console.log("login: " + this._user.login);
            console.log("password: " + this._user.password);
            if (this._user.login !== "" && this._user.password !== "")
            {
                debugger
            }
            else
            {
              this.setRootPage(LoginPage);
            }
          }
          else
          {
            this.setRootPage(LoginPage);
          }
        }
        else
        {
          alert("Не удалось получить таблицу настроек!");
        }
      }).catch((err)=>{
        alert(err.message);
      })

    });

  }
  setRootPage(page: any)
  {
    this.rootPage = page;
  }

  getDbData(){
    let asyncTask = new Promise((resolve, reject) => {
      try {
        let t1 = this.db.getValue("login").then((res) => this._user.login = res);
        let t2 = this.db.getValue("password").then((res) => this._user.password = res);
        let t3 = this.db.getValue("isAuth").then((res) => this._user.isAuth = res);
        let t4 = this.db.getValue("isRemember").then((res) => this._user.isRemember = res);
        let t5 = this.db.getValue("serverToken").then((res) => this._user.serverToken = res);
        return Promise.all([t1, t2, t3, t4, t5]).then(()=> resolve(true));
      }
      catch (err){
        reject(new Error('Ошибка получения таблицы настроек ' + err.message));
      }
    });
    return asyncTask;
  }

        

}
