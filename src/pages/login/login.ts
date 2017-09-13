import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DbProvider } from '../../providers/db/db';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  account: { login: string, password: string } = {
    login: "",
    password: ""
  };
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private db: DbProvider, private user: UserProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async ionViewWillEnter(){
    this.account.login = await this.db.getValue("login");
    this.account.password = await this.db.getValue("password");
  }

  saveForm(f: NgForm){
  

    this.user.login("")  
    this.db.setValue('login', this.account.login);
    this.db.setValue('password', this.account.password);
    

  }
}
