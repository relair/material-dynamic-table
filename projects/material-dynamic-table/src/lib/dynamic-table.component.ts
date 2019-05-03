import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatSort, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
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

  displayedColumns: string[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private appliedFilters: { [key: string]: ColumnFilter; } = {};
  
  constructor(private readonly columnFilterService: ColumnFilterService, private readonly dialog: MatDialog) { }

  ngOnInit() {
    if (this.dataSource == null) {
      throw Error('DynamicTable must be provided with data source.');
    }
    if (this.columns == null) {
      throw Error('DynamicTable must be provided with column definitions.');
    }

    this.displayedColumns = this.columns.map((column, index) => this.prepareColumnName(column.name, index));
    
    const dataSource = this.dataSource as any;
    dataSource.sort = this.sort;
    dataSource.paginator = this.paginator;
  }

  canFilter(column: ColumnConfig) {
    const filter = this.columnFilterService.getFilter(column.type);

    return filter != null;
  }

  isFiltered(column: ColumnConfig) {
    return this.appliedFilters[column.name];
  }

  prepareColumnName(name: string, columnNumber: number) {   
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
}