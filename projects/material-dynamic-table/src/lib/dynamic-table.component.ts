import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/table';

import { MdtMultiSort } from './multi-sort/multi-sort.directive';
import { ColumnConfig } from './column-config.model';
import { ColumnFilter } from './column-filter.model';
import { ColumnFilterService } from './table-cell/cell-types/column-filter.service';

@Component({
  selector: 'mdt-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {

  @Input() columns: ColumnConfig[];
  @Input() dataSource: DataSource<any>;
  @Input() pageSize = 20;
  @Input() pageSizeOptions = [20, 50, 100];
  @Input() showFilters = true;
  @Input() stickyHeader = false;
  @Input() multiSort = false;
  @Input() hintDelay = 500;
  @Input() paginator: MatPaginator;

  @Output() rowClick = new EventEmitter<any>();

  displayedColumns: string[];

  @ViewChild(MdtMultiSort, { static: true }) sort: MdtMultiSort;
  @ViewChild(MatPaginator, { static: true }) private internalPaginator: MatPaginator;

  private appliedFilters: { [key: string]: any; } = {}; 

  constructor(private readonly columnFilterService: ColumnFilterService, private readonly dialog: MatDialog) { }

  ngOnInit() {
    if (this.dataSource == null) {
      throw Error('DynamicTable must be provided with data source.');
    }
    if (this.columns == null) {
      throw Error('DynamicTable must be provided with column definitions.');
    }

    if (this.paginator === undefined) {
      this.paginator = this.internalPaginator;
    }

    this.columns.forEach((column, index) => column.name = this.prepareColumnName(column.name, index));
    this.displayedColumns = this.columns.map((column, index) => column.name);

    const dataSource = this.dataSource as any;
    dataSource.sort = this.sort;
    dataSource.paginator = this.paginator;
  }

  isUsingInternalPaginator() {
    return this.paginator === this.internalPaginator;
  }

  canFilter(column: ColumnConfig) {
    const filter = this.columnFilterService.getFilter(column.type);

    return filter != null;
  }

  isFiltered(column: ColumnConfig) {
    return this.appliedFilters[column.name];
  }

  getFilterDescription(column: ColumnConfig) {
    const filter = this.appliedFilters[column.name];
    if (!filter || !filter.getDescription) {
      return null;
    }

    return filter.getDescription();
  }

  prepareColumnName(name: string | undefined, columnNumber: number) {
    return name || 'col' + columnNumber;
  }

  filter(column: ColumnConfig) {
    const filter = this.columnFilterService.getFilter(column.type);

    if (filter) {
      const dialogConfig = new MatDialogConfig();
      const columnFilter = new ColumnFilter();
      columnFilter.column = column;

      if (this.appliedFilters[column.name]) {
        columnFilter.filter = Object.create(this.appliedFilters[column.name]);
      }

      dialogConfig.data = columnFilter;

      const dialogRef = this.dialog.open(filter, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.appliedFilters[column.name] = result;
        } else if (result === '') {
          delete this.appliedFilters[column.name];
        }

        if (result || result === '') {
          this.updateDataSource();
        }
      });
    }
  }

  clearFilters() {
    this.appliedFilters = {};
    this.updateDataSource();
  }

  protected updateDataSource() {
    const dataSource = this.dataSource as any;
    dataSource.filters = this.getFilters();
  }

  getFilters() {
    const filters = this.appliedFilters;
    const filterArray = Object.keys(filters).map((key) => filters[key]);
    return filterArray;
  }

  getFilter(columnName: string): any {
    const filterColumn = this.getColumnByName(columnName);

    if (!filterColumn) {
      throw Error(`Column with name '${columnName}' does not exist.`);
    }

    return this.appliedFilters[filterColumn.name];
  }

  setFilter(columnName: string, filter: any) {
    const filterColumn = this.getColumnByName(columnName);

    if (!filterColumn) {
      throw Error(`Cannot set filter for a column. Column with name '${columnName}' does not exist.`);
    }

    this.appliedFilters[filterColumn.name] = filter;
    this.updateDataSource();
  }

  getSort() {
    return this.sort.sortedBy;
  }

  setSort(sortedBy: { id: string, direction: 'asc' | 'desc' }[]) {
    this.sort.sortedBy = sortedBy;
  }

  private getColumnByName(columnName: string): ColumnConfig | undefined {
    return this.columns.find(c =>
      (c.name ? c.name.toLowerCase() : c.name) === (columnName ? columnName.toLowerCase() : columnName)
    );
  }

  onRowClick(row: any) {
    this.rowClick.next(row);
  }
}
