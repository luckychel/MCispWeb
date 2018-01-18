import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Network } from '@ionic-native/network';
import 'rxjs/add/operator/map';
import { DbProvider } from '../../providers/db/db';

@Injectable()
export class ApiProvider {
  url: string = 'http://localhost:60544/api'; //'http://services2.ssnab.ru:8020/api';

  constructor(public http: Http, private network: Network, private db: DbProvider) {
      
  }

  async get(endpoint: string, params?: any, options?: RequestOptions) {

    this.checkNetworkConnection();
    
    options =  await this.getOptions(options);

    if (params) {
      let p = new URLSearchParams();
      for (let k in params) {
        p.set(k, params[k]);
      }
      options.search = !options.search && p || options.search;
    }
    return this.http.get(this.url + '/' + endpoint, options).toPromise();
  }

  async post(endpoint: string, body?: any, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.post(this.url + '/' + endpoint, body,  await this.getOptions(options)).toPromise();
  }

  async put(endpoint: string, body: any, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.put(this.url + '/' + endpoint, body,  await this.getOptions(options)).toPromise();
  }

  async delete(endpoint: string, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.delete(this.url + '/' + endpoint,  await this.getOptions(options)).toPromise();
  }

  async patch(endpoint: string, body: any, options?: RequestOptions) {
    this.checkNetworkConnection();
    return this.http.put(this.url + '/' + endpoint, body, await this.getOptions(options)).toPromise();
  }

  async getOptions(options){
    let serverToken = await this.db.getValue("serverToken").then((res) => { return res });

    if (!options) options = new RequestOptions();
    let headers = new Headers();
    if (serverToken) { 
      headers.append('Authorization', 'Bearer ' + serverToken);
    }
    options.headers = headers;
    return options;
  }

  checkNetworkConnection(){
    var networkState = (this.network.type || "").toUpperCase();
    if (networkState === "") return "";

    var states = {};
    states["UNKNOWN"]  = 'Unknown connection';
    states["ETHERNET"] = 'Ethernet connection';
    states["WIFI"]     = 'WiFi connection';
    states["CELL_2G"]  = 'Cell 2G connection';
    states["CELL_3G"]  = 'Cell 3G connection';
    states["CELL_4G"]  = 'Cell 4G connection';
    states["CELL"]     = 'Cell generic connection';
    states["NONE"]     = 'No network connection';

    if (states[networkState] == "No network connection") {
      throw new Error("Вы не подключены к сети интернет...");
    }
  }
}
