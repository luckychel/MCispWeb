import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noop } from 'rxjs/util/noop';
import { Observable, Subject} from 'rxjs';

// searchbar default options
const defaultOpts = {
  cancelButtonText: 'Cancel',
  showCancelButton: false,
  debounce: 250,
  placeholder: 'Search',
  autocomplete: 'off',
  autocorrect: 'off',
  spellcheck: 'off',
  type: 'search',
  value: '',
  noItems: '',
  clearOnEdit: false,
  clearInput: false
};

@Component({
   selector: 'ion-picker',
    template: `
<ion-searchbar
        #searchbarElem
        (ionInput)="getItems($event)"
        (tap)="tapped($event)"
        [(ngModel)]="keyword"
        (ngModelChange)="updateModel()"
        [cancelButtonText]="options.cancelButtonText == null ? defaultOpts.cancelButtonText : options.cancelButtonText"
        [showCancelButton]="options.showCancelButton == null ? defaultOpts.showCancelButton : options.showCancelButton"
        [debounce]="options.debounce == null ? defaultOpts.debounce : options.debounce"
        [placeholder]="options.placeholder == null ? defaultOpts.placeholder : options.placeholder"
        [autocomplete]="options.autocomplete == null ? defaultOpts.autocomplete : options.autocomplete"
        [autocorrect]="options.autocorrect == null ? defaultOpts.autocorrect : options.autocorrect"
        [spellcheck]="options.spellcheck == null ? defaultOpts.spellcheck : options.spellcheck"
        [type]="options.type == null ? defaultOpts.type : options.type"
        [disabled]="disabled"
        [ngClass]="{'hidden': useIonInput}"
        (ionClear)="clearValue(true, $event)"
        (ionFocus)="onFocus()"
        (ionBlur)="onBlur()"
>
</ion-searchbar>
<ng-template #defaultTemplate let-attrs="attrs">
    <span [innerHTML]='(attrs.nameAttribute ? attrs.data[attrs.nameAttribute] : attrs.data) | boldprefix:attrs.keyword'></span>
</ng-template>
<ul *ngIf="!disabled && suggestions.length > 0 && showList">
    <li *ngFor="let suggestion of suggestions" (tap)="select(suggestion);$event.srcEvent.stopPropagation()">
        <ng-template
                [ngTemplateOutlet]="template || defaultTemplate"
                [ngOutletContext]="
                  {attrs:{ data: suggestion, keyword: keyword, nameAttribute: dataProvider.nameAttribute }}">
        </ng-template>
    </li>
</ul>
<p *ngIf="suggestions.length == 0 && showList && options.noItems">{{ options.noItems }}</p>
`,
providers: [
  {provide: NG_VALUE_ACCESSOR, useExisting: IonPickerComponent, multi: true}
]})
export class IonPickerComponent implements ControlValueAccessor {


@Input() public dataProvider: any;
@Input() public options: any;
@Input() public disabled: any;
@Input() public keyword: string;

@Input() public showResultsFirst: boolean;
@Input() public alwaysShowList: boolean;
@Input() public hideListOnSelection: boolean = true;
@Input() public template: TemplateRef<any>;
@Input() public useIonInput: boolean;
@Input() public autolookup: any;
@Input() public filter: any;

@Output() public id: any;
@Output() public name: any;

@Output() public autoFocus: EventEmitter<any>;
@Output() public autoBlur: EventEmitter<any>;
@Output() public itemSelected:  EventEmitter<any>;
@Output() public itemCleared: EventEmitter<string>;
@Output() public itemChanged: EventEmitter<string>;
@Output() public itemsShown:  EventEmitter<any>;
@Output() public itemsHidden:  EventEmitter<any>;
@Output() public ionAutoInput:  EventEmitter<string>;
@ViewChild('searchbarElem') searchbarElem;

private onTouchedCallback: () => void = noop;
private onChangeCallback: (_: any) => void = noop;
public suggestions:  string[];


public get showList(): boolean {
    return this._showList;
}
public set showList(value: boolean) {
    if (this._showList === value) {
        return;
    }

    this._showList = value;
    this.showListChanged = true;
}

public get cleared(): boolean {
    return this._cleared;
}
public set cleared(value: boolean) {
    if (this._cleared === value) {
        return;
    }
    this._cleared = value;
}

public get lastSearchBar(): string {
    return this._lastSearchbar;
}
public set lastSearchBar(value: string) {
    if (this._lastSearchbar === value) {
        return;
    }
    this._lastSearchbar = value;
}

private _lastSearchbar: string;
private _showList: boolean;
private _cleared: boolean;
private defaultOpts:  any;
private selection: any;
private showListChanged: boolean = false;

/**
* create a new instace
*/
public constructor() {
    this.keyword = '';
    this.suggestions = [];
    this.autolookup = null;
    this.filter = null;
    this._showList = false;
    this.itemSelected = new EventEmitter<any>();
    this.itemCleared = new EventEmitter<any>();
    this.itemChanged = new EventEmitter<any>();
    this.itemsShown = new EventEmitter<any>();
    this.itemsHidden = new EventEmitter<any>();
    this.ionAutoInput = new EventEmitter<string>();
    this.autoFocus = new EventEmitter<any>();
    this.autoBlur = new EventEmitter<any>();
    this.options = {};
    // set default options
    this.defaultOpts = defaultOpts;
    this.id = "";
    this.name = "";
}

public writeValue(value: any) {
    if (value !== this.keyword) {
        let parsedValue;
        if (value) {
            const { nameAttribute } = this.dataProvider;
            parsedValue = this.dataProvider.nameAttribute && typeof value === 'object' ? value[nameAttribute] : value;
            this.selection = value || null;
        }

        this.keyword = parsedValue || '';
    }
}

public registerOnChange(fn: any) {
    this.onChangeCallback = fn;
}

public registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
}

public updateModel() {
    this.onChangeCallback(this.keyword);
    this.autolookup = null;
    this.itemChanged.emit(this.keyword);
}

ngAfterViewChecked() {
    if (this.showListChanged) {
        this.showListChanged = false;
        this.showList ? this.itemsShown.emit() : this.itemsHidden.emit();
    }
}

tapped(ev){

    if (this.showList || this.selection != null)
    {
        this.showList = false;
        return;
    }
    return (this.showResultsFirst || this.keyword.length > 0) && this.getItems()
}

/**
* get items for auto-complete
*/
public getItems() {
    
    if (this.cleared) {this.cleared = false; return;}

    let result;

    if (this.showResultsFirst && this.keyword.trim() === '') {
        this.keyword = '';
    } else if (this.keyword.trim() === '' && this.autolookup === null && this.filter === null) {
        this.suggestions = [];
        return;
    }
    
    if (typeof this.dataProvider === 'function') {
        result = this.dataProvider(this.keyword, this.autolookup, this.filter);
    } else {
        result = this.dataProvider.getResults(this.keyword, this.autolookup, this.filter);
    }

    
    // if result is instanceof Subject, use it asObservable
    if (result instanceof Subject) {
        result = result.asObservable();
    }

    // if query is async
    if (result instanceof Observable) {
        result
            .subscribe(
                (results: any) => {
                    this.suggestions = results;
                    this.showItemList();
                },
                (error: any) => console.error(error)
            )
        ;
    } else {
        this.suggestions = result;
        this.showItemList();
    }

    // emit event
    this.ionAutoInput.emit(this.keyword);
}

/**
* show item list
*/
public showItemList(): void {
    this.showList = true;
}

/**
* hide item list
*/
public hideItemList(): void {
    this.showList = this.alwaysShowList;
}

/**
* select item from list
*
* @param event
* @param selection
**/
public select(selection: any): void {
    this.keyword = this.dataProvider.nameAttribute == null || selection[this.dataProvider.nameAttribute] == null 
    ? selection : selection[this.dataProvider.nameAttribute];
    this.hideItemList();

    // emit selection event
    this.updateModel();

    if(this.hideListOnSelection) {
        this.hideItemList();
    }

    if (this.options.id && selection[this.options.id]) this.id = selection[this.options.id];
    if (this.options.name && selection[this.options.id]) this.name = selection[this.options.name];

    this.selection = selection;
    
    // emit selection event
    this.itemSelected.emit(selection);
}

/**
* get current selection
* @returns {any}
*/
public getSelection(): any {
    return this.selection;
}

/**
* get current input value
* @returns {string}
*/
public getValue() {
    return this.keyword;
}

/**
* set current input value
*/
public setValue(value: string) {
    this.keyword = value || '';
    return;
}

public setSettings(autolookup: any, filter: any){
    this.autolookup = autolookup;
    this.filter = filter;
    this.getItems();
    this.hideItemList();

    if (autolookup !== null && this.suggestions.length == 1)
        this.select(this.suggestions[0]);
}

/**
/**
* clear current input value
*/
public clearValue(hideItemList: boolean = false, ev) {
    
    this.keyword = '';

    this.itemCleared.emit(this.selection);
    
    this.selection = null;

    if (hideItemList) {
        this.hideItemList();
    }

    this.cleared = true;

    return;
}

/**
* set focus of searchbar
*/
public setFocus() {
    if (this.searchbarElem) {
        this.searchbarElem.setFocus();
    }
}

/**
* fired when the input focused
*/
onFocus() {
    this.autoFocus.emit();
}

/**
* fired when the input focused
*/
onBlur() {
    this.autoBlur.emit();
}

/**
* handle document click
* @param event
*/
public 
@HostListener('document:click', ['$event'])
    private documentClickHandler(event) {
        /* console.log('До ' + this.lastSearchBar || '');
        if (event.target && event.target.className == "searchbar-input")
        {
            if (!this.lastSearchBar)
            {
                this.lastSearchBar = event.target.placeholder;
            }
            else
            {
                if (this.lastSearchBar != event.target.placeholder)
                {
                    console.log('hide')
                    this.showList = false;
                    this.lastSearchBar = event.target.placeholder;
                }
            }
        }
        else
        {
            console.log('hide')
            this.showList = false;
        }
        console.log('После ' + this.lastSearchBar || '') */
        //
        if (this.searchbarElem) {
            if (!this.searchbarElem._elementRef.nativeElement.contains(event.target)
            || (event.target && event.target.className != "searchbar-input"))
            {
                this.hideItemList();
            }
          }
    }
}