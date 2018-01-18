import { Injectable } from '@angular/core';
import { ApiProvider } from '../../../api/api';
import { IonPickerService} from '../../../../component/ion-picker/ion-picker-service';

@Injectable()
export class BunkProvider implements IonPickerService  {
  idAttibute = "BUNK_ID";
  nameAttribute = "BUNK_NAME";
  items= [];

  constructor(public api: ApiProvider) {
    
  }

  getResults(keyword:string, autolookup:any, filter: any) {

      this.items = [
          {
            BUNK_ID: 1,
            BUNK_NAME: "Рыба1"
          },
          {
            BUNK_ID: 2,
            BUNK_NAME: "Кошка домашняя"
          },
          {
            BUNK_ID: 3,
            BUNK_NAME: "Тигр гималайский"
          },
          {
            BUNK_ID: 4,
            BUNK_NAME: "Собака домашняя"
          },
          {
            BUNK_ID: 5,
            BUNK_NAME: "Гиеновидная собака"
          },
          {
            BUNK_ID: 9,
            LINKED: 11,
            BUNK_NAME: "Медведь бурый"
          },
          {
            BUNK_ID: 10,
            LINKED: 11,
            BUNK_NAME: "Панда"
          },
        ];
    
        return this.items = this.items.filter((item) => {
    
          let r0 = keyword.trim() === "";
          let r1: Boolean = (item[this.nameAttribute].toLowerCase().indexOf(keyword.trim().toLowerCase()) > -1);
    
          let r2: Boolean = false;
          let r3: Boolean = false;
          if (autolookup && autolookup[this.idAttibute]) {
            r2 = true;
            r3 = item[this.idAttibute] == autolookup[this.idAttibute];
          }
    
          let r4: Boolean = false;
          let r5: Boolean = false;
          if (filter) {
            r4 = true;
            for(var key in filter) {
                if (item[key] == filter[key]){
                  r5 = item[key] == filter[key];
                  break;
                }
            }
          }
          return (
                  //keyword
                    (!r0 && r1 && !r2 && !r4)
                  || (r0 && r1 && !r2 && !r4)
                    //lookup
                  || (!r0 && r1 && r2 && r3 && !r5)
                  || (r0 && r1 && r2 && r3 && !r5)
                  // filter
                  || (!r0 && r1 && !r2 && !r3 && r5)
                  || (r0 && r1 && !r2 && !r3 && r5)
                  // lookup && filter
                  || (!r0 && r1 && r2 && r3 && r5)
                  || (r0 && r1 && r2 && r3 && r5)
                )
        }).map(function(el) {
            return el;
        }).slice(0,20); 
        
      }
}
