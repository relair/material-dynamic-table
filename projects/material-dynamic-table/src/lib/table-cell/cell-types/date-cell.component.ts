import { Component, Input, OnInit } from '@angular/core';
import { CellComponent } from './cell.component';
import { ColumnConfig } from '../../column-config.model';

@Component({
    selector: 'mdt-date-cell',
    template: '{{ row[column.name] | date:dateFormat }}'
})
export class DateCellComponent implements CellComponent, OnInit {
    @Input() column: ColumnConfig;
    @Input() row: object;

    dateFormat = 'short';

    ngOnInit() {
        if (this.column.options) {
            if (this.column.options.dateFormat) {
                this.dateFormat = this.column.options.dateFormat;
            }
        }
    }
}