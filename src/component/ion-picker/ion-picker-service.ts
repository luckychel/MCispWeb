
export interface IonPickerService {
        
        idAttibute?:string;

        /**
         * the literal name of the title attribute
         */
        nameAttribute?: string;
    
        /**
         * this method should return an array of objects (results)
         * @param term
         */
        getResults(term: any, autolookup: any, filter: any): any;
    
        /**
         * this method parses each item of the results from data service.
         * the returned value is the displayed form of the result
         * @param item
         */
        parseItem?(item: any): any;
    }