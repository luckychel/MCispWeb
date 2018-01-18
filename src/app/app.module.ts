import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule/* , Http */ } from '@angular/http';
import { Network } from '@ionic-native/network';
import { MCispComponentModule } from '../component/mcisp.component.module'

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { PriceFilterPage } from '../pages/price-filter/price-filter';
import { PriceFilterChoisePage } from '../pages/price-filter-choise/price-filter-choise';

import { IonicStorageModule } from '@ionic/storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiProvider } from '../providers/api/api';
import { DbProvider } from '../providers/db/db';
import { UserProvider } from '../providers/user/user';

import { PriceProvider } from '../providers/price/price';
import { BunkProvider } from '../providers/price/pickers/bunk/bunk';
import { BunkTovProvider } from '../providers/price/pickers/bunktov/bunktov';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    PriceFilterPage,
    PriceFilterChoisePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MCispComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    PriceFilterPage,
    PriceFilterChoisePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    DbProvider,
    UserProvider,
    PriceProvider,
    BunkProvider,
    BunkTovProvider,
    
  ]
})
export class AppModule {}
