import { Component, Input } from '@angular/core';
import { CellComponent } from './cell.component';
import { ColumnConfig } from '../../column-config.model';

@Component({
    selector: 'mdt-text-cell',
    template: '<span click="navFunction(row)">{{ row[column.name] }}</span>'
})
export class TextCellComponent implements CellComponent {
    @Input() column: ColumnConfig;
    @Input() row: object;
    //navUrl: string;
}