import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, LoadingController } from 'ionic-angular';

import { PriceProvider } from '../../providers/price/price';
/* import { BunkProvider } from '../../providers/price/pickers/bunk/bunk';
import { BunkTovProvider } from '../../providers/price/pickers/bunktov/bunktov';
 */
import { PriceFilterChoisePage } from '../price-filter-choise/price-filter-choise';
import { debounce } from 'ionic-angular/util/util';


@Component({
  selector: 'page-price-filter',
  templateUrl: 'price-filter.html',
})
export class PriceFilterPage {
  
  items: any;
  filter: any;
  args: any;
  findText: string = "Найдено 0 записей";

/*
  @ViewChild('searchbarBunk') searchbarBunk: IonPickerComponent;
  @ViewChild('searchbarBunkTov') searchbarBunkTov: IonPickerComponent; 
  this.searchbarBunkTov.setSettings(null, {"LINKED": 11});
*/

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public priceService: PriceProvider,
 /*    public bunkService: BunkProvider,
    public bunkTovService: BunkTovProvider, */
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController
  ) 
  {
    this.filter = { 
      BUNK_ID: "-",
      BUNK_NAME: "",
      BUNKTOV_DEPT_ID: "-",
      BUNKTOV_DEPT_NAME: "",
      PLIST_ID: "-",
      PLIST: "",
      PLIST_LEVEL_ID: "",
      PLIST_LEVEL: "",
      CCY_ID: "",
      CCY: ""
    }

    this.args = { 
      StartRowIndex: 0,
      MaximumRows: 30,
      SortExpression: "",
      RetrieveTotalRowCount: true,
      TotalRowCount: 0
    }
  }

  //список фильров по умолчанию
  ionViewDidLoad(){
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Загрузка фильтров...'
    });
    loading.present();

    this.priceService.getPlistsFilter()
      .then((dfilter)=> {
        
        let r1 = this.getBunks({Search: null, PlistId: dfilter.PLIST_ID, BunkId: dfilter.BUNK_ID});
        let r2 = this.getSaleDepts(null);
        let r3 = this.getPlists({Search: null, PlistId: dfilter.PLIST_ID});
        let r4 = this.getPlistLevels({Search: null, PlistId: dfilter.PLIST_ID});
        let r5 = this.getCcy({Search: "RUR"});

        Promise.all([r1, r2, r3])
          .then((res)=>{
            loading.dismiss();
            this.getPlist();
          })
          .catch((err)=> { 
            loading.dismiss();
            throw new Error(err.message);
          });

    }).catch((err)=>{
        alert(err.message)
        loading.dismiss();
    });

  }

//получение "Склад" фильтра
getBunks(filter):Promise<any>{
  if (filter.Search == "")
    return;

  return this.priceService.getBunks(filter)
    .then((res)=>{
      if (filter.Search == null)
      {
        if (res.result.bunks[0] !== undefined)
        {
          this.filter.BUNK_ID = res.result.bunks[0].bunk_id;
          this.filter.BUNK_NAME = res.result.bunks[0].name;
        }
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

//получение "Отдел" фильтра
 getSaleDepts(filter):Promise<any>{
  return this.priceService.getSaleDepts(filter)
  .then((res)=>{
    if (res.result[0] !== undefined)
    {
      this.filter.BUNKTOV_DEPT_ID = res.result[0].DEPT_ID;
      this.filter.BUNKTOV_DEPT_NAME = res.result[0].NAME;
    }
    Promise.resolve();
  }).catch((err)=>{
    Promise.reject(err.message);
  });
 }

//получение "Прайс" фильтра
getPlists(filter):Promise<any>{
  if (filter.Search == "")
    return;

  this.priceService.getPlists(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.PLIST_ID = res.result[0].PLIST_ID;
        this.filter.PLIST = res.result[0].PLIST;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

//получение "Прайс Д" фильтра
getPlistLevels(filter):Promise<any>{
  if (filter.Search == "")
    return;

  this.priceService.getPlistLevels(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.PLIST_LEVEL_ID = res.result[0].LEVEL_ID;
        this.filter.PLIST_LEVEL = res.result[0].NAME;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

//получение "Валюта" фильтра
getCcy(filter):Promise<any>{
  if (filter.Search == "")
    return;

  this.priceService.getCCY(filter).then((res)=>{
      if (res.result[0] !== undefined)
      {
        this.filter.CCY_ID = res.result[0].CCY_ID;
        this.filter.CCY = res.result[0].NAME;
      }
      Promise.resolve();
    }).catch((err)=>{
      Promise.reject(err.message);
    });
}

  //поиск по прайс листу
  getPlist():Promise<any>{
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Загрузка прайс листа...'
    });
    loading.present();
    //debugger;
    return this.priceService.getPlist({filter: this.filter, args: this.args})
      .then((data)=>{
        
        if (data && data.result) {
          if (data.result.plist) {
            this.items = data.result.plist;
          }
          if (data.result.args) {
            this.args = data.result.args;
            this.findText = "Найдено " + data.result.args.TotalRowCount + " записей";
          }
        }
        loading.dismiss();
        Promise.resolve();
      }).catch((err)=>{
        loading.dismiss();
        Promise.reject(err.message);
      });
  }
 
  //склады
  standartBunkHeight(){
    if (this.filter.BUNK_NAME==='') 
      return true;
    else
      return false;
  }

  onBunkSelect()
  {
    this.showModalView("BUNK_ID", "склада");
  }

  onBunkClear(ev) { 
    this.filter.BUNK_ID = "";
    this.filter.BUNK_NAME = "";
  }

  //отделы
  standartBunkTovDeptHeight(){
    if (this.filter.BUNKTOV_DEPT_NAME==='') 
      return true;
    else
      return false;
  }

  onBunkTovDeptSelect()
  {
    this.showModalView("BUNKTOV_DEPT_ID", "отдела");
  }

  onBunkTovDeptClear(ev) { 
    this.filter.BUNKTOV_DEPT_ID = "";
    this.filter.BUNKTOV_DEPT_NAME = "";
  }

  //Прайс
  standartPlistHeight(){
    if (this.filter.PLIST==='') 
      return true;
    else
      return false;
  }

  onPlistSelect(){
    this.showModalView("PLIST_ID", "прайса");
  }

  onPlistClear(ev) { 
    this.filter.PLIST_ID = "";
    this.filter.PLIST = "";
  }

//Прайс Д
standartPlistLevelHeight(){
  if (this.filter.PLIST_LEVEL==='') 
    return true;
  else
    return false;
}

onPlistLevelSelect(){
  this.showModalView("PLIST_LEVEL_ID", "прайса д");
}

onPlistLevelClear(ev) { 
  this.filter.PLIST_LEVEL_ID = "";
  this.filter.PLIST_LEVEL = "";
}

//Валюта
standartCcyHeight(){
  if (this.filter.CCY==='') 
    return true;
  else
    return false;
}

onCcySelect(){
  this.showModalView("CCY_ID", "валюты");
}

onCcyClear(ev) { 
  this.filter.CCY_ID = "";
  this.filter.CCY = "";
}

//показ модальной формы с фильтром
  showModalView(key, keyText){
    let profileModal = this.modalCtrl.create(PriceFilterChoisePage, {
      key: key,
      keyText: keyText,
      filter: this.filter
    });
    profileModal.onDidDismiss(data => {
      if (data) {
        if (this.filter.PLIST_ID && this.filter.PLIST_ID != 30)
        {
          this.filter.PLIST_LEVEL_ID = "";
          this.filter.PLIST_LEVEL = "";
        }
        this.filter = data;
        this.getPlist();
      }
    });
    profileModal.present();
  }

  onSubmit() {
    console.log("submit")
    console.log(this.filter);
  }

  /* onClear(){
    console.log("clear")
    console.log(this.filter);
  }
  */
 }
