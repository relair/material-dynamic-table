import { Type, Injectable } from '@angular/core';

@Injectable()
export class ColumnFilterService {

    private registeredFilters: { [key: string]: Type<any>; } = {};
    
    registerFilter(type: string, component: Type<any>) {
        this.registeredFilters[type] = component;
    }

    getFilter(type: string): Type<any> {
        const component = this.registeredFilters[type];
        
        return component;
    }
}