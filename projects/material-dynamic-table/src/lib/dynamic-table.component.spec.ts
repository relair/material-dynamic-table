import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { DynamicTableComponent } from './dynamic-table.component';
import { TableCellComponent } from './table-cell/table-cell.component';
import { ColumnFilterService } from './table-cell/cell-types/column-filter.service';

describe('DynamicTableComponent', () => {
  let component: DynamicTableComponent;
  let fixture: ComponentFixture<DynamicTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatIconModule,
        MatDialogModule,
        NoopAnimationsModule
      ],
      declarations: [
        DynamicTableComponent,
        TableCellComponent
      ],
      providers: [        
        ColumnFilterService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTableComponent);
    component = fixture.componentInstance;

    component.columns = [
      {
        name: 'product',
        displayName: 'Product',
        type: 'string'
      },
      {
        name: 'created',
        displayName: 'Created Date',
        type: 'date',
        options: {
          dateFormat: 'shortDate'
        }
      }
    ];
    component.dataSource = new MatTableDataSource<object>([]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
