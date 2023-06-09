import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';

import { OptionsCellComponent } from './cells/options-cell/options-cell.component';

import { TextFilterComponent } from './filters/text-filter/text-filter.component';
import { DateFilterComponent } from './filters/date-filter/date-filter.component';

import { CellService, ColumnFilterService, DynamicTableModule } from 'material-dynamic-table';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    OptionsCellComponent,
    TextFilterComponent,
    DateFilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DynamicTableModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly cellService: CellService, private readonly columnFilterService: ColumnFilterService) {
    cellService.registerCell('options', OptionsCellComponent);

    columnFilterService.registerFilter('string', TextFilterComponent);
    columnFilterService.registerFilter('date', DateFilterComponent);
  }
}
