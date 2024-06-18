import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FilteredDataSource } from './data-source/filtered-data-source';
import { ColumnConfig, DynamicTableComponent } from 'material-dynamic-table';
import { Product } from './product';
import { TextFilter } from './filters/text-filter/text-filter.model';
import { DateFilter } from './filters/date-filter/date-filter.model';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'material-dynamic-table-demo';

  @ViewChild(DynamicTableComponent, { static: true }) dynamicTable: DynamicTableComponent;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  columns: ColumnConfig[] = [
    {
      name: 'product',
      displayName: 'Product',
      type: 'string',
      sticky: 'start'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string',
      sort: false
    },
    {
      name: 'category',
      displayName: 'Category',
      type: 'string',
    },
    {
      name: 'recievedOn',
      displayName: 'Recieved On',
      type: 'date'
    },
    {
      name: 'created',
      displayName: 'Created Date',
      type: 'date',
      options: {
        dateFormat: 'shortDate'
      }
    },
    {
      name: '',
      type: 'options',
      sticky: 'end',
      sort: false
    }
  ];

  data: Product[] = [
    {
      product: 'Mouse',
      description: 'Fast and wireless',
      category: 'Peripherals',
      recievedOn: new Date('2018-01-02T11:05:53.212Z'),
      created: new Date('2015-04-22T18:12:21.111Z')
    },
    {
      product: 'Keyboard',
      description: 'Loud and Mechanical',
      category: 'Peripherals',
      recievedOn: new Date('2018-06-09T12:08:23.511Z'),
      created: new Date('2015-03-11T11:44:11.431Z')
    },
    {
      product: 'Laser',
      description: 'It\'s bright',
      category: 'Space',
      recievedOn: new Date('2017-05-22T18:25:43.511Z'),
      created: new Date('2015-04-21T17:15:23.111Z')
    },
    {
      product: 'Baby food',
      description: 'It\'s good for you',
      category: 'Food',
      recievedOn: new Date('2017-08-26T18:25:43.511Z'),
      created: new Date('2016-01-01T01:25:13.055Z')
    },
    {
      product: 'Coffee',
      description: 'Prepared from roasted coffee beans',
      category: 'Food',
      recievedOn: new Date('2015-04-16T23:52:23.565Z'),
      created: new Date('2016-12-21T21:05:03.253Z')
    },
    {
      product: 'Cheese',
      description: 'A dairy product',
      category: 'Food',
      recievedOn: new Date('2017-11-06T21:22:53.542Z'),
      created: new Date('2014-02-11T11:34:12.442Z')
    },
    {
      product: 'Floppy disk',
      description: 'It belongs in a museum',
      category: 'Storage',
      recievedOn: new Date('2015-10-12T11:12:42.621Z'),
      created: new Date('2013-03-12T21:54:31.221Z')
    },
    {
      product: 'Fan',
      description: 'It will blow you away',
      category: 'Hardware',
      recievedOn: new Date('2014-05-04T01:22:35.412Z'),
      created: new Date('2014-03-18T23:14:18.426Z')
    }
  ];

  dataSource = new FilteredDataSource<Product>(this.data);

  clearFilters() {    
    this.dynamicTable.clearFilters();
    this.dynamicTable.setSort([]);
  }

  setFilter() {
    const createdColumnName = 'created';

    this.dynamicTable.setSort([{ id: 'category', direction: 'asc' }, { id: 'product', direction: 'desc' }]);

    const appliedFilter = this.dynamicTable.getFilter(createdColumnName);
    if (!appliedFilter) {
      const filter = new DateFilter(createdColumnName);
      filter.fromDate = new Date(2015, 1, 1);
      filter.toDate = new Date(2015, 12, 31);

      this.dynamicTable.setFilter(createdColumnName, filter);      
    } else {
      const columnName = 'description';
      const filter = new TextFilter(columnName);
      filter.value = 'Loud';

      this.dynamicTable.setFilter(columnName, filter);      
    }
  }

  onRowClick(row: any) {
    console.log(row);
  }
}
