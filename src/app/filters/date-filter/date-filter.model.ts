import { DatePipe } from '@angular/common';
import { TableFilter } from '../../data-source/table-filter';
import { FilterDescription } from 'material-dynamic-table';

export class DateFilter implements TableFilter, FilterDescription {
    fromDate: Date;
    toDate: Date;

    public constructor(private readonly column: string) {
    }
    
    getFilter(): object {
        const filter = {};
        
        if (this.fromDate && this.toDate) {
            filter[this.column] = { ge: this.fromDate, le: this.toDate };
        } else if (this.fromDate) {
            filter[this.column] = { ge: this.fromDate };
        } else if (this.toDate) {
            filter[this.column] = { le: this.toDate };
        }

        return filter;
    }

    getDescription() {
        if (!this.fromDate && !this.toDate) {
            return null;
        }

        const datePipe = new DatePipe('en-US');
        const formatDate = (date: Date) => datePipe.transform(date, 'shortDate');

        if (this.fromDate && this.toDate) {
            return `is between ${formatDate(this.fromDate)} and ${formatDate(this.toDate)}`;
        } else if (this.fromDate) {
            return `is after ${formatDate(this.fromDate)}`;
        } else if (this.toDate) {
            return `is before ${formatDate(this.toDate)}`;
        }           
    }
}