import { Component, Input } from '@angular/core';
import { CellComponent, ColumnConfig } from 'material-dynamic-table';
import { Product } from '../../product';

@Component({
    selector: 'ld-options-cell',
    templateUrl: './options-cell.component.html'
})
export class OptionsCellComponent implements CellComponent {
    @Input()
    column: ColumnConfig;

    @Input()
    row: Product;

    constructor() {}

    showDetails() {
        const productName = this.row.product;

        alert(`Product name is ${productName}.`);
    }
}