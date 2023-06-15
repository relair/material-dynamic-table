import { MdtTableDataSource, TableFilter } from 'material-dynamic-table';

export class FilteredDataSource<T> extends MdtTableDataSource<T> {

  filterPredicate = (data: T): boolean => {
    if (!this.filters || !this.filters.length) {
      return true;
    }

    const result = this.filters.reduce((visible: boolean, tableFilter: TableFilter) => {
      if (!visible) {
        return visible;
      }

      const filter = tableFilter.getFilter();

      return Object.keys(filter).reduce((show, columnName) => {
        if (!show) {
          return show;
        }
        return this.matchesFilter(filter[columnName], data[columnName]);
      }, true);
    }, true);

    return result;
  }

  private matchesFilter(filterForColumn: any, dataForColumn: any): boolean {

    if (filterForColumn.contains && dataForColumn.indexOf(filterForColumn.contains) !== -1) {
      return true;
    }

    if (filterForColumn.le && filterForColumn.ge) {
      if (dataForColumn.getTime() >= filterForColumn.ge.getTime() && dataForColumn.getTime() <= filterForColumn.le.getTime()) {
        return true;
      }
    } else if (filterForColumn.ge && dataForColumn.getTime() >= filterForColumn.ge.getTime()) {
      return true;
    } else if (filterForColumn.le && dataForColumn.getTime() <= filterForColumn.le.getTime()) {
      return true;
    }

    return false;
  }
}