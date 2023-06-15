import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
  Inject,
  ElementRef
} from '@angular/core';
import { MdtMultiSort } from './multi-sort.directive';
import { SortDirection, MatSortable, matSortAnimations, MatSortHeader, MatSortHeaderIntl } from '@angular/material/sort';
import { FocusMonitor } from '@angular/cdk/a11y';

/**
 * Valid positions for the arrow to be in for its opacity and translation. If the state is a
 * sort direction, the position of the arrow will be above/below and opacity 0. If the state is
 * hint, the arrow will be in the center with a slight opacity. Active state means the arrow will
 * be fully opaque in the center.
 *
 * @docs-private
 */
export type ArrowViewState = SortDirection | 'hint' | 'active';

/**
 * States describing the arrow's animated position (animating fromState to toState).
 * If the fromState is not defined, there will be no animated transition to the toState.
 * @docs-private
 */
export interface ArrowViewStateTransition {
  fromState?: ArrowViewState;
  toState: ArrowViewState;
}

/** Column definition associated with a `MatSortHeader`. */
interface MatSortHeaderColumnDef {
  name: string;
}

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent MatSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  selector: '[mdt-sort-header]',
  exportAs: 'mdtSortHeader',
  templateUrl: 'multi-sort-header.html',
  styleUrls: ['multi-sort-header.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  animations: [
    matSortAnimations.indicator,
    matSortAnimations.leftPointer,
    matSortAnimations.rightPointer,
    matSortAnimations.arrowOpacity,
    matSortAnimations.arrowPosition,
    matSortAnimations.allowChildren,
  ]
})
export class MdtMultiSortHeader extends MatSortHeader implements MatSortable, OnDestroy, OnInit {
 
  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  @Input('mdt-sort-header') id: string;

  /** Overrides the sort start value of the containing MatSort for this MatSortable. */
  @Input() start: 'asc' | 'desc' = 'asc';

  private _sortHeader: MdtMultiSort;

  constructor(public _intl: MatSortHeaderIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() public _multiSort: MdtMultiSort,
    @Inject('MAT_SORT_HEADER_COLUMN_DEF') @Optional() public _columnDef: MatSortHeaderColumnDef,
    _focusMonitor: FocusMonitor,
    _elementRef: ElementRef<HTMLElement>) {
    // Note that we use a string token for the `_columnDef`, because the value is provided both by
    // `material/table` and `cdk/table` and we can't have the CDK depending on Material,
    // and we want to avoid having the sort header depending on the CDK table because
    // of this single reference.
    super(_intl, changeDetectorRef, _multiSort, _columnDef, _focusMonitor, _elementRef);
    this._sortHeader = _multiSort;
  }

  _handleClick() {
    //this._sort.direction = this.getSortDirection();
    super._handleClick();
  }
      
  /** Whether this MatSortHeader is currently sorted in either ascending or descending order. */
  _isSorted() {
    if (!this._sortHeader.sortedBy) {
      return false;
    }

    let sort = this._sortHeader.sortedBy.find(s => s.id === this.id);
    return !!sort;
  }

  /**
   * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
   * facing the start direction. Otherwise if it is sorted, the arrow should point in the currently
   * active sorted direction. The reason this is updated through a function is because the direction
   * should only be changed at specific times - when deactivated but the hint is displayed and when
   * the sort is active and the direction changes. Otherwise the arrow's direction should linger
   * in cases such as the sort becoming deactivated but we want to animate the arrow away while
   * preserving its direction, even though the next sort direction is actually different and should
   * only be changed once the arrow displays again (hint or activation).
   */
  _updateArrowDirection() {
    this._arrowDirection = this.getSortDirection();
  }

  /**
   * Gets the aria-sort attribute that should be applied to this sort header. If this header
   * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
   * says that the aria-sort property should only be present on one header at a time, so removing
   * ensures this is true.
   */
  _getAriaSortAttribute() {
    if (!this._isSorted()) {
      return 'none';
    }

    let sort = this._sortHeader.sortedBy.find(s => s.id === this.id)!;
    return sort.direction == 'asc' ? 'ascending' : 'descending';
  }

  getSortDirection(): 'asc' | 'desc' | '' {
    if (!this._isSorted()) {
      return '';
    }

    let sort = this._sortHeader.sortedBy.find(s => s.id === this.id)!;
    return sort.direction;
  }

  /**
   * Gets the sort counter that will display whenever multisort is enabled. It shows the order
   * in which sort is applied, whenever there are multiple columns being used for sorting.
   */
  _getSortCounter(): string {
    if (!this._sortHeader.sortedBy || this._sortHeader.mode !== 'multi') {
      return '';
    }
    const index = this._sortHeader.sortedBy.findIndex(s => s.id === this.id);
    if (index === -1) {
      return '';
    }

    return (index + 1).toString();
  }
}
