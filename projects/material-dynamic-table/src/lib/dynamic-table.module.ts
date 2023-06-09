import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { DynamicTableComponent } from './dynamic-table.component';
import { TableCellComponent } from './table-cell/table-cell.component';

import { CellService } from './table-cell/cell-types/cell.service';
import { CellDirective } from './table-cell/cell.directive';
import { ColumnFilterService } from './table-cell/cell-types/column-filter.service';

export { CellService, CellDirective, ColumnFilterService };
export { CellComponent } from './table-cell/cell-types/cell.component';
export { ColumnFilter } from './column-filter.model';
export { ColumnConfig } from './column-config.model';
export { FilterDescription } from './filter-description';

import { TextCellComponent } from './table-cell/cell-types/text-cell.component';
import { DateCellComponent } from './table-cell/cell-types/date-cell.component';

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule
    ],
    declarations: [
        DynamicTableComponent,
        TableCellComponent,
        CellDirective,
        TextCellComponent,
        DateCellComponent
    ],
    exports: [DynamicTableComponent],
    providers: [
        CellService,
        ColumnFilterService
    ]
})
export class DynamicTableModule {
  constructor(private readonly cellService: CellService) {
    cellService.registerCell('string', TextCellComponent);
    cellService.registerCell('date', DateCellComponent);
  }
}
