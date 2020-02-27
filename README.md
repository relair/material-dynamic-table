# material-dynamic-table

Dynamic table component for angular built on top of angular material table. It offers sorting, pagination, filtering per column and the ability to specify content types and components used for displaying them.
The initial purpose of this library was to display data coming from OData API, although it can work with MatTableDataSource (however it needs to be extended to enable filtering - see example).

## Demo

Online demo: https://stackblitz.com/edit/dynamic-table

Run `ng serve` for the main project to launch demo for this library.

## Getting started

#### 1. Prerequisites:

Angular material:
Please follow https://material.angular.io/guide/getting-started

Filter is using material icon, so adding material icons may be needed as well:
https://material.angular.io/guide/getting-started#step-6-optional-add-material-icons

#### 2. Install material-dynamic-table:

```bash
npm install material-dynamic-table --save
```

#### 3. Import the installed libraries:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DynamicTableModule } from 'material-dynamic-table';

import { AppComponent } from './app';

@NgModule({
  ...
  imports: [
    ...

    DynamicTableModule
  ],
})
export class AppModule {}

```

#### 4. Include `mdt-dynamic-table` in your component:

```ts
<mdt-dynamic-table [columns]="columns" [dataSource]="dataSource"></mdt-dynamic-table>
```

#### 5. Specify column definitions and data source:
```ts
import { Component } from '@angular/core';

import { ColumnConfig } from 'material-dynamic-table';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
 columns: ColumnConfig[] = [
    {
      name: 'product',
      displayName: 'Product',
      type: 'string'
    },
    {
      name: 'description',
      displayName: 'Description',
      type: 'string'
    },
    {
      name: 'recievedOn',
      displayName: 'Received On',
      type: 'date'
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

  data: object[] = [
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
    }
  ];

   dataSource = new FilteredDataSource<object>(this.data);
}
```

## Further info

#### API reference for material-dynamic-table

##### Properties
| Name         | Description                                                                                         |
|--------------|-----------------------------------------------------------------------------------------------------|
| @Input() columns: ColumnConfig[]     | Column definition for dynamic table, order will determine column order      |
| @Input() dataSource: DataSource<any> | Data source that provides data for dynamic table                            |
| @Input() pageSize: number            | Initial page size for pagination - default 20                               |
| @Input() pageSizeOptions :  number[] | The set of provided page size options to display to the user.               |
| @Input() showFilters: boolean        | If the filters are defined adds the ability to turn them off - default true |
| @Input() stickyHeader : boolean      | Whether the table should have sticky header                                 |
| @Input() paginator : MatPaginator    | Paginator to be used instead of internal paginator or null to hide internal |


##### Methods
| Name         | Description                                                                                         |
|--------------|-----------------------------------------------------------------------------------------------------|
| getFilter(columnName: string): any         | Returns currently set filter for the column with provided name        |
| setFilter(columnName: string, filter: any) | Sets the filter for the column with provided name                     |
| getFilters()                               | Returns all set column filters                                        |
| clearFilters()                             | Removes all applied filters                                           |


#### ColumnConfig definition
ColumnConfig is used to provide specification for the columns to be displayed

| Property         | Description                                                                                |
|------------------|--------------------------------------------------------------------------------------------|
| name             | Name of the property to display - it should match propery name from data source            |
| displayName      | Name to be displayed in column header                                                      |
| type             | Type of the data displayed by this column - it should match one of your defined cell types |
| options          | Optional field that can be used to pass extra data for cells                               |
| sticky           | Optional field that can make column sticky to start or end of table. Values: 'start', 'end'|
| sort             | Optional field that can disable sort on the column if the value is false                   |

#### Cell types
By default there are two types provided:
###### string
This displays plain string value for property defined under `name` in ColumnConfig.
This is the default type used if there is no type specified for the data type.
###### date
This type will format property from `ColumnConfig.name` as date. It can take additional parameter in `ColumnConfig.options` - `dateFormat`, which specifies what date format should be used (default is 'short')

#### Adding additional cell types
New cell types can be defined by adding a component, inheriting from CellComponent

Here is an example of options cell that can be used for showing possible actions

```ts
import { Component, Input } from '@angular/core';
import { CellComponent, ColumnConfig } from 'material-dynamic-table';
import { Product } from '../../product';

@Component({
    selector: 'ld-options-cell',
    template: `<mat-menu #appMenu="matMenu">
  <button mat-menu-item  (click)="showDetails()">View Details</button>
</mat-menu>

<button mat-icon-button color="primary" [matMenuTriggerFor]="appMenu">
   <mat-icon>more_vert</mat-icon>
 </button>`
})
export class OptionsCellComponent implements CellComponent {
    @Input()
    column: ColumnConfig;

    @Input()
    row: Product;

    constructor() {}

    showDetails() {
        const productName = this.row.product;

        alert(`Product name is ${productName}.`);
    }
}
```

Cell types then need to be registered:
```ts
import { OptionsCellComponent } from './cells/optionsCell/options-cell.component';

@NgModule({
  ...
  declarations: [
    ...

    OptionsCellComponent
  ],
  entryComponents: [
    ...
      
    OptionsCellComponent
  ]
})
export class AppModule {
  constructor(private readonly cellService: CellService) {
    cellService.registerCell('options', OptionsCellComponent);
  }
}
```

#### Adding filters
Filters icon an the column will be displayed whenever there is a registered filter for that columns type. To add a filter first create a component for modal dialog with a model that implements your filter interface. Then register it in the following way:

```ts
import { TextFilterComponent } from './filters/text-filter/text-filter.component';

@NgModule({
  ...
  declarations: [
    ...

    TextFilterComponent
  ],
  entryComponents: [
    ...
      
    TextFilterComponent
  ]
})
export class AppModule {
  constructor(private readonly columnFilterService: ColumnFilterService) {
    columnFilterService.registerFilter('string', TextFilterComponent);
  }
}
```

In this case it is a filter for `string` cell type named `TextFilterComponent`. See the example project for full design.
To make use of filters you need to have data source that can handle them. See `FilteredDataSource` from the example to see how `MatTableDataSource` can be extended to handle it.

Filters can have a description that is displayed when the filter is applied. To set the description for the filter the filter model should have a method getDescription that returns a string.
Implement interface 'FilterDescription' for your filter model to have the description displayed.