import { Injectable } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { DbProvider } from '../../providers/db/db';
import { debounce } from 'ionic-angular/util/util';

@Injectable()
export class PriceProvider {

  constructor(public api: ApiProvider, public db: DbProvider) {
    console.log('Hello PriceProvider Provider');
  }

  async getPlistsFilter(){
    return await this.api.post("price/plistfilter")
     .then((res) => {
        return Promise.resolve(res.json())
      }).catch((err)=>{
        Promise.reject(err);
      });
  }

  async getPlist(plistParams){
    return await this.api.post("price/plist", plistParams)
    .then((res) => {
       return Promise.resolve(res.json())
     }).catch((err)=>{
       Promise.reject(err);
     });
  }

  async getBunks(bunksParams){
    return await this.api.post("price/bunks", bunksParams)
    .then((res) => {
       return Promise.resolve(res.json())
     }).catch((err)=>{
       Promise.reject(err);
     });
  }

  async getSaleDepts(searchParams) {
    if (searchParams == null || searchParams === undefined) {
      searchParams = {Search: ""};
    }
    return await this.api.post("price/saledepts", searchParams)
    .then((res) => {
       return Promise.resolve(res.json())
     }).catch((err)=>{
       Promise.reject(err);
     });
  }
  
  async getPlists(plistsParams){
    return await this.api.post("price/plists", plistsParams)
    .then((res) => {
       return Promise.resolve(res.json())
     }).catch((err)=>{
       Promise.reject(err);
     });
  }

  async getPlistLevels(plistsParams)
  {
    return await this.api.post("price/plistlevels", plistsParams)
    .then((res) => {
       return Promise.resolve(res.json())
     }).catch((err)=>{
       Promise.reject(err);
     });
  }

  async getCCY(searchParams)
  {
    return await this.api.post("price/ccy", searchParams)
    .then((res) => {
       return Promise.resolve(res.json())
     }).catch((err)=>{
       Promise.reject(err);
     });
  }
}
