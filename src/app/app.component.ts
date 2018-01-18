import { Component } from '@angular/core';
import { Platform, ToastController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PriceFilterPage } from '../pages/price-filter/price-filter';
import { PriceFilterChoisePage } from '../pages/price-filter-choise/price-filter-choise';

//import { ApiProvider } from '../providers/api/api';
import { DbProvider } from '../providers/db/db';
import { UserProvider } from '../providers/user/user';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {

  rootPage: any = null;
  loader: any;
  _user : any;
  

  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen, 
    //private api: ApiProvider, 
    private db: DbProvider, 
    private user: UserProvider,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

      /* this._user = user._user;
      this.getDbData().then(()=>{

        //вход с токеном
        if (this._user.serverToken !== "" && this._user.isRemember)
        {
          this.user.checkToken().then(() => {
            this.setRootPage(HomePage);
          }).catch((err)=>{
            this.showToastr(err.message);
            this.setRootPage(LoginPage);
          });
        }
        else {
          this.setRootPage(LoginPage);
        }

      }).catch((err)=>{
        this.showToastr(err.message);
      }) */

      this.setRootPage(PriceFilterPage);
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
        return Promise.all([t1, t2, t3, t4, t5])
        .then(()=> resolve(true))
        .catch((err)=> reject(new Error('Ошибка сохранения данных в таблицу настроек ' + err.message)));
      }
      catch (err){
        reject(new Error('Ошибка получения таблицы настроек ' + err.message));
      }
    });
    return asyncTask;
  }

  showToastr(message){
      let toast = this.toastCtrl.create({
        message: message,
        duration: 3000,
        position: 'top'
      });
      toast.present();
  }      

}
