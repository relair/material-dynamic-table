import {
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatSort, MatSortable, SortDirection } from '@angular/material/sort';
import { MdtMultiSortHeader } from './multi-sort-header';

/** The current sort state. */
export interface MultiSort {
  sortedBy: { id: string, direction: 'asc' | 'desc' }[];
}

/** Container for MatSortables to manage the sort state and provide default sort parameters. */
@Directive({
  selector: '[mdtMultiSort]',
  exportAs: 'mdtMultiSort',
  inputs: ['disabled: matSortDisabled']
})
export class MdtMultiSort extends MatSort implements OnChanges, OnDestroy, OnInit {

  /**
   * The array of active sort ids. Order defines sorting precedence.
   */
  @Input('mdtSortActive')
  get sortedBy() {
    return this._sortedBy;
  }
  set sortedBy(sortedBy: { id: string, direction: 'asc' | 'desc' }[]) {
    this._sortedBy = sortedBy;
    let sort = sortedBy ? sortedBy[0] : undefined;
    let sortedValue = sort ? { active: sort.id, direction: sort.direction } : undefined;
    this.sortChange.emit(sortedValue);
    this.multiSortChange.emit({ sortedBy: this._sortedBy });
  }

  private _sortedBy: { id: string, direction: 'asc' | 'desc' }[]

  start: 'asc' | 'desc' = 'asc';

  @Input('mode') mode: 'single' | 'multi' = 'single';

  isSortDirectionValid(direction: { [id: string]: SortDirection }): boolean {
    return Object.keys(direction).every((id) => this.isIndividualSortDirectionValid(direction[id]));
  }

  isIndividualSortDirectionValid(direction: string): boolean {
    return !direction || direction === 'asc' || direction === 'desc';
  }

  /** Event emitted when the user changes either the active sort or sort direction. */
  @Output('matSortChange')
  readonly multiSortChange: EventEmitter<MultiSort> = new EventEmitter<MultiSort>();

  /** Sets the active sort id and determines the new sort direction. */
  sort(sortable: MatSortable): void {
    if (!Array.isArray(this.sortedBy)) {
      let direction = sortable.start ? sortable.start : this.start;
      this._sortedBy = [{
        id: sortable.id,
        direction: direction
      }];  
    } else {
      const sort = this._sortedBy.find(s => s.id === sortable.id);
      if (sort) {
        this.direction = sort.direction;
        let nextDirection = this.getNextSortDirection(sortable);        
        if (nextDirection) {
          sort.direction = nextDirection;
        } else {
          let index = this._sortedBy.indexOf(sort);
          this._sortedBy.splice(index, 1);
        }
      } else {
        let newSort = {
          id: sortable.id,
          direction: sortable.start ? sortable.start : this.start
        }
        if (this.mode === 'multi') {
          this._sortedBy.push(newSort);
        } else {
          this._sortedBy = [newSort]
        }
      }
    }

    this.multiSortChange.emit({ sortedBy: this._sortedBy });   
    super.sort(sortable);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
