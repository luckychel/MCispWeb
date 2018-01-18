import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DbProvider } from '../../providers/db/db';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  constructor(public navCtrl: NavController, private db: DbProvider ) {
    
  }

  async btnClear(){
    await this.db.setValue('login', "");
    await this.db.setValue('password', "");
    await this.db.setValue('isRemember', "");
    await this.db.setValue('molId', "");
    await this.db.setValue('molName', "");
    await this.db.setValue('molPhoto', "");
    await this.db.setValue('serverToken', "");
    this.navCtrl.setRoot(LoginPage);
  }

  btnChangeUser(){
    this.navCtrl.setRoot(LoginPage);
  }

}
