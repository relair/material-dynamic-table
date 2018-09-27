import { MatTableDataSource } from '@angular/material';
import { TableFilter } from './table-filter';

export class FilteredDataSource<T> extends MatTableDataSource<T> {
    private _filters: TableFilter[];

    set filters(filters: TableFilter[]) {
        this._filters = filters;
        this.filter = ' '; // Workaround to trigger filtering
    }

    /**
     * Filter predicate that will use _filters to filter.
     * This is a workaround as filterPredicate interface only allows filter to be a string.
     */
    filterPredicate = (data: T): boolean => {
        if (!this._filters || !this._filters.length) {
            return true;
        }

        for (const tableFilter of this._filters) {
            const filter = tableFilter.getFilter();
            for (const key of Object.keys(filter)) {
                if (filter[key].contains && data[key].indexOf(filter[key].contains) !== -1) {
                    return true;
                }
                
                if (filter[key].le && filter[key].ge) {                    
                    if (data[key].getTime() >= filter[key].ge.getTime() && data[key].getTime() <= filter[key].le.getTime()) {
                        return true;
                    }
                } else if (filter[key].ge && data[key].getTime() >= filter[key].ge.getTime()) {
                    return true;
                } else if (filter[key].le && data[key].getTime() <= filter[key].le.getTime()) {
                    return true;
                }
            }            
        }

        return false;
    }
}