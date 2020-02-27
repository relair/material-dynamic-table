import { TableFilter } from '../../data-source/table-filter';
import { FilterDescription } from 'material-dynamic-table';

export class TextFilter implements TableFilter, FilterDescription {
    value: string;

    public constructor(private readonly column: string) {
        this.value = '';
    }
    
    getFilter(): object {
        const filter = {};

        filter[this.column] = { contains: this.value };
        
        return filter;
    }

    getDescription() {
        if (!this.value) {
            return null;
        }

        return `contains '${this.value}'`;        
    }
}