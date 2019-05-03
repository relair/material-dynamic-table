import { Component, ViewChild } from '@angular/core';

import { FilteredDataSource } from './data-source/filtered-data-source';
import { ColumnConfig, DynamicTableComponent } from 'material-dynamic-table';
import { Product } from './product';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'material-dynamic-table-demo';

  @ViewChild(DynamicTableComponent) dynamicTable: DynamicTableComponent;

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
      type: 'options',
      sticky: 'end'
    }
  ];

  data: Product[] = [
    {
      product: 'Mouse',
      description: 'Fast and wireless',
      recievedOn: new Date('2018-01-02T11:05:53.212Z'),
      created: new Date('2015-04-22T18:12:21.111Z')
    },
    {
      product: 'Keyboard',
      description: 'Loud and Mechanical',
      recievedOn: new Date('2018-06-09T12:08:23.511Z'),
      created: new Date('2015-03-11T11:44:11.431Z')
    },
    {
      product: 'Laser',
      description: 'It\'s bright',
      recievedOn: new Date('2017-05-22T18:25:43.511Z'),
      created: new Date('2015-04-21T17:15:23.111Z')
    },
    {
      product: 'Baby food',
      description: 'It\'s good for you',
      recievedOn: new Date('2017-08-26T18:25:43.511Z'),
      created: new Date('2016-01-01T01:25:13.055Z')
    },
    {
      product: 'Coffee',
      description: 'Prepared from roasted coffee beans',
      recievedOn: new Date('2015-04-16T23:52:23.565Z'),
      created: new Date('2016-12-21T21:05:03.253Z')
    },
    {
      product: 'Cheese',
      description: 'A dairy product',
      recievedOn: new Date('2017-11-06T21:22:53.542Z'),
      created: new Date('2014-02-11T11:34:12.442Z')
    },
    {
      product: 'Floppy disk',
      description: 'It belongs in a museum',
      recievedOn: new Date('2015-10-12T11:12:42.621Z'),
      created: new Date('2013-03-12T21:54:31.221Z')
    },
    {
      product: 'Fan',
      description: 'It will blow you away',
      recievedOn: new Date('2014-05-04T01:22:35.412Z'),
      created: new Date('2014-03-18T23:14:18.426Z')
    }
  ];

  dataSource = new FilteredDataSource<Product>(this.data);

  clearFilters() {
    this.dynamicTable.clearFilters();
  }
}
