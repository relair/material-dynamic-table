import { TableFilter } from '../../data-source/table-filter';

export class DateFilter implements TableFilter {
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
}