import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController, MenuController } from 'ionic-angular';

import { NgForm} from '@angular/forms';
import { DbProvider } from '../../providers/db/db';
import { UserProvider } from '../../providers/user/user';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loader: any;
  _user : any;

  account: { login: string, password: string, isRemember: boolean } = {
    login: "",
    password: "",
    isRemember: false
  };

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private db: DbProvider, 
    private user: UserProvider,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public menuCtrl: MenuController,
 ) 
  {
    console.log("constructor login")
    this._user = user._user;
  }

  async ionViewWillEnter(){
    this.account.login = await this.db.getValue("login");
    this.account.password = await this.db.getValue("password");
    let r = await this.db.getValue("isRemember");
    this.account.isRemember = (r === "false" || r === false ? false : r === "" ? false : true);
  }

  doLogin(f: NgForm){

    if (!this.checkOnEmpty()) 
      return;

    this.showLoader();

    this.user.login(this.account)
      .then((res)=> {
        if (this.user._user.isAuth) {
           this.navCtrl.setRoot(HomePage);
        }
        else {
          this.showToastr("Ошибка авторизации! " + this.user._user.authError);
        } 
        this.hideLoader();
      })
      .catch((err)=>{
        this.showToastr("Ошибка авторизации! " + err.message);
        this.hideLoader();
      })
  }

  checkOnEmpty(){
    let err: string = "";
    if (this.account.login === "") 
      err = "Заполните поле \"Логин\"";
    else if (this.account.password === "")
      err = "Заполните поле \"Пароль\"";
    if (err !== "")
    {
      this.showToastr(err);
      return false;
    }
    else 
      return true;
  }

  showLoader(){
    this.loader = this.loadingCtrl.create({
      content: 'Пожалуйста подождите...'
    });
    this.loader.present();
  }
  
  hideLoader(){
    setTimeout(() => {
        this.loader.dismiss();
    });
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
