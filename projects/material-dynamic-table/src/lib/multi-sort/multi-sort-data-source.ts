import { DataSource } from '@angular/cdk/collections';
import { _isNumberValue } from '@angular/cdk/coercion';
import { Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Observable, BehaviorSubject, Subject, Subscription, of, merge, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { MdtMultiSort } from './multi-sort.directive';
import { TableFilter } from './table-filter';

const MAX_SAFE_INTEGER = 9007199254740991;

export class MdtTableDataSource<T> extends DataSource<T> {
  
  private readonly _data: BehaviorSubject<T[]>;

  /** Stream emitting render data to the table (depends on ordered data changes). */
  private readonly _renderData = new BehaviorSubject<T[]>([]);

  /** Stream that emits when a new filter string is set on the data source. */
  private readonly _filter = new BehaviorSubject<string>('');

  private readonly _filters = new BehaviorSubject<TableFilter[]>([]);

  /** Used to react to internal changes of the paginator that are made by the data source itself. */
  private readonly _internalPageChanges = new Subject<void>();

  _renderChangesSubscription: Subscription | null = null;

  filteredData: T[];

  constructor(initialData: T[] = []) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
    this._updateChangeSubscription();
  }

  /** Array of data that should be rendered by the table, where each object represents one row. */
  get data() {
    return this._data.value;
  }

  set data(data: T[]) {
    data = Array.isArray(data) ? data : [];
    this._data.next(data);
    if (!this._renderChangesSubscription) {
      this._filterData(data);
    }
  }

  get filter(): string {
    return this._filter.value;
  }

  set filter(filter: string) {
    this._filter.next(filter);
    if (!this._renderChangesSubscription) {
      this._filterData(this.data);
    }
  }

  get filters(): TableFilter[] {
    return this._filters.value;
  }
  set filters(filters: TableFilter[]) {
    this._filters.next(filters);
    this._updateChangeSubscription();
  }

  get sort(): MdtMultiSort | null { return this._multiSort; }
  set sort(sort: MdtMultiSort | null) {
    this._multiSort = sort;
    this._updateChangeSubscription();
  }
  private _multiSort: MdtMultiSort | null;
 
  get paginator(): MatPaginator | null {
    return this._paginator;
  }
  set paginator(paginator: MatPaginator | null) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }
  private _paginator: MatPaginator | null;

  sortingDataAccessor: (data: T, sortHeaderId: string) => string | number = (
    data: T,
    sortHeaderId: string,
  ): string | number => {
    const value = (data as unknown as Record<string, any>)[sortHeaderId];

    if (_isNumberValue(value)) {
      const numberValue = Number(value);

      // Numbers beyond `MAX_SAFE_INTEGER` can't be compared reliably so we
      // leave them as strings. For more info: https://goo.gl/y5vbSg
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }

    return value;
  };

  connect() {
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }

    return this._renderData;
  }

  disconnect() {
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = null;
  }

  _updateChangeSubscription() {
    const sortChange: Observable<Sort | null | void> = this._multiSort
      ? (merge(this._multiSort.multiSortChange, this._multiSort.initialized) as Observable<Sort | void>)
      : of(null);
    const pageChange: Observable<PageEvent | null | void> = this._paginator
      ? (merge(
        this._paginator.page,
        this._internalPageChanges,
        this._paginator.initialized,
      ) as Observable<PageEvent | void>)
      : of(null);
    const dataStream = this._data;
    // Watch for base data or filter changes to provide a filtered set of data.
    const filteredData = combineLatest([dataStream, this._filter]).pipe(
      map(([data]) => this._filterData(data)),
    );
    const filteredData2 = combineLatest([filteredData, this._filters]).pipe(
      map(([data]) => this._filterData(data)),
    );
    // Watch for filtered data or sort changes to provide an ordered set of data.
    const orderedData = combineLatest([filteredData2, sortChange]).pipe(
      map(([data]) => this._orderData(data)),
    );
    // Watch for ordered data or page changes to provide a paged set of data.
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(
      map(([data]) => this._pageData(data)),
    );
    // Watched for paged data changes and send the result to the table to render.
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe(data => this._renderData.next(data));
  }

  _filterData(data: T[]) {
    // If there is a filter string, filter out data that does not contain it.
    // Each data object is converted to a string using the function defined by filterPredicate.
    // May be overridden for customization.
    this.filteredData =
      (this.filter == null || this.filter === '') && !this.filters?.length
        ? data
        : data.filter(obj => this.filterPredicate(obj, this.filter));

    if (this.paginator) {
      this._updatePaginator(this.filteredData.length);
    }

    return this.filteredData;
  }

  filterPredicate: (data: T, filter: string) => boolean = (data: T, filter: string): boolean => {
    const dataStr = Object.keys(data as unknown as Record<string, any>)
      .reduce((currentTerm: string, key: string) => {
        return currentTerm + (data as unknown as Record<string, any>)[key] + '◬';
      }, '')
      .toLowerCase();

    const transformedFilter = filter.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) != -1;
  };

  _pageData(data: T[]): T[] {
    if (!this.paginator) {
      return data;
    }

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(startIndex, startIndex + this.paginator.pageSize);
  }

  _orderData(data: T[]): T[] {
    // If there is no active sort or direction, return the data without trying to sort.
    if (!this.sort) {
      return data;
    }

    return this.sortData(data.slice(), this.sort);
  }

  sortData: ((data: T[], sort: MdtMultiSort) => T[]) =
    (data: T[], sort: MdtMultiSort): T[] => {
      let sortedBy = sort.sortedBy;
      if (!Array.isArray(sortedBy) || !sortedBy.length) {
        return data;
      }

      return data.sort((a, b) => {
        // Get effective sort value after comparing all sorted properties, if values were equal for
        // previous propery then compare the next pair
        return sortedBy.reduce((previous, sort) => {
          if (previous !== 0) {
            return previous;
          }

          let valueA = this.sortingDataAccessor(a, sort.id);
          let valueB = this.sortingDataAccessor(b, sort.id);

          return this.compareValues(valueA, valueB, sort.direction);
        }, 0);
      });
    }

  compareValues(valueA: string | number, valueB: string | number, direction: string) {
    let comparatorResult = 0;
    if (direction == '') {
      return comparatorResult;
    }

    if (valueA != null && valueB != null) {
      // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
      if (valueA > valueB) {
        comparatorResult = 1;
      } else if (valueA < valueB) {
        comparatorResult = -1;
      }
    } else if (valueA != null) {
      comparatorResult = 1;
    } else if (valueB != null) {
      comparatorResult = -1;
    }

    return comparatorResult * (direction == 'asc' ? 1 : -1);
  }

  _updatePaginator(filteredDataLength: number) {
    Promise.resolve().then(() => {
      const paginator = this.paginator;

      if (!paginator) {
        return;
      }

      paginator.length = filteredDataLength;

      // If the page index is set beyond the page, reduce it to the last page.
      if (paginator.pageIndex > 0) {
        const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
        const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);

        if (newPageIndex !== paginator.pageIndex) {
          paginator.pageIndex = newPageIndex;

          // Since the paginator only emits after user-generated changes,
          // we need our own stream so we know to should re-render the data.
          this._internalPageChanges.next();
        }
      }
    });
  }
}
