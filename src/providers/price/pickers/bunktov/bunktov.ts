import { Injectable } from '@angular/core';
import { ApiProvider } from '../../../api/api';
import { IonPickerService} from '../../../../component/ion-picker/ion-picker-service';

@Injectable()
export class BunkTovProvider implements IonPickerService  {

  idAttibute = "BUNKTOV_DEPT_ID";
  nameAttribute = "BUNKTOV_DEPT_NAME";
  items= [];

  constructor(public api: ApiProvider) {
    
  }

  getResults(keyword:string, autolookup:any, filter: any) {

    this.items = [
      {
        BUNKTOV_DEPT_ID: 4,
        BUNKTOV_DEPT_NAME: "Рыба1"
      },
      {
        BUNKTOV_DEPT_ID: 5,
        BUNKTOV_DEPT_NAME: "Кошка домашняя"
      },
      {
        BUNKTOV_DEPT_ID: 6,
        BUNKTOV_DEPT_NAME: "Тигр гималайский"
      },
      {
        BUNKTOV_DEPT_ID: 7,
        BUNKTOV_DEPT_NAME: "Собака домашняя"
      },
      {
        BUNKTOV_DEPT_ID: 8,
        BUNKTOV_DEPT_NAME: "Гиеновидная собака"
      },
      {
        BUNKTOV_DEPT_ID: 9,
        LINKED: 11,
        BUNKTOV_DEPT_NAME: "Медведь бурый"
      },
      {
        BUNKTOV_DEPT_ID: 10,
        LINKED: 11,
        BUNKTOV_DEPT_NAME: "Панда"
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
