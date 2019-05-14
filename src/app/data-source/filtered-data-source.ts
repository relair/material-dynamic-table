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

        const result = this._filters.reduce((visible, tableFilter) => {
            if (!visible) {
                return visible;
            }

            const filter = tableFilter.getFilter();

            return Object.keys(filter).reduce((show, columnName) => {
                if (!show) {
                    return show;
                }
                return this.matchesFilter(filter[columnName], data[columnName]);
            }, true);
        }, true);

        return result;
    }

    private matchesFilter(filterForColumn: any, dataForColumn: any): boolean {        

        if (filterForColumn.contains && dataForColumn.indexOf(filterForColumn.contains) !== -1) {
            return true;
        }
        
        if (filterForColumn.le && filterForColumn.ge) {                    
            if (dataForColumn.getTime() >= filterForColumn.ge.getTime() && dataForColumn.getTime() <= filterForColumn.le.getTime()) {
                return true;
            }
        } else if (filterForColumn.ge && dataForColumn.getTime() >= filterForColumn.ge.getTime()) {
            return true;
        } else if (filterForColumn.le && dataForColumn.getTime() <= filterForColumn.le.getTime()) {
            return true;
        }

        return false;
    }
}