import { TableFilter } from '../../dataSource/table-filter';

export class TextFilter implements TableFilter {
    value: string;

    public constructor(private readonly column: string) {
        this.value = '';
    }
    
    getFilter(): object {
        const filter = {};

        filter[this.column] = { contains: this.value };
        
        return filter;
    }
}