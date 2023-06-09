import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

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
