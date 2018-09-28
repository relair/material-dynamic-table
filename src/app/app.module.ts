import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatInputModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  MatIconModule
} from '@angular/material';

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
    MatIconModule
  ],
  entryComponents: [
    OptionsCellComponent,  
    TextFilterComponent,
    DateFilterComponent
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