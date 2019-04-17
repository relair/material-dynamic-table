/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CanDisable, HasInitialized } from '@angular/material/core';
import { Subject } from 'rxjs';
import { SortDirection } from './sort-direction';
import { MatSortable, _MatSortMixinBase } from './sort';
/** The current sort state. */
export interface MultiSort {
    /** The id of the column being sorted. */
    active: string[];
    /** The sort direction. */
    direction: {
        [id: string]: SortDirection;
    };
}
/** Container for MatSortables to manage the sort state and provide default sort parameters. */
export declare class MatMultiSort extends _MatSortMixinBase implements CanDisable, HasInitialized, OnChanges, OnDestroy, OnInit {
    /** Used to notify any child components listening to state changes. */
    readonly _stateChanges: Subject<void>;
    /**
     * The array of active sort ids. Order defines sorting precedence.
     */
    active: string[];
    /**
     * The direction to set when an MatSortable is initially sorted.
     * May be overriden by the MatSortable's sort start.
     */
    start: 'asc' | 'desc';
    /**
     * The sort direction of the currently active MatSortable. If multicolumn sort is enabled
     * this will contain a dictionary of sort directions for active MatSortables.
     */
    direction: {
        [id: string]: SortDirection;
    };
    private _direction;
    isSortDirectionValid(direction: {
        [id: string]: SortDirection;
    }): boolean;
    isIndividualSortDirectionValid(direction: string): boolean;
    /** Event emitted when the user changes either the active sort or sort direction. */
    readonly sortChange: EventEmitter<MultiSort>;
    /** Sets the active sort id and determines the new sort direction. */
    sort(sortable: MatSortable): void;
    /** Returns the next sort direction of the active sortable, checking for potential overrides. */
    getNextSortDirection(sortable: MatSortable): SortDirection;
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
}
