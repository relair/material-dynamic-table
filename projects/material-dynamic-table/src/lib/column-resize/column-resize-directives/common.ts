/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Provider } from '@angular/core';

import { ColumnResize } from '../column-resize';
import { ColumnResizeNotifier, ColumnResizeNotifierSource } from '../column-resize-notifier';
import { HeaderRowEventDispatcher } from '../event-dispatcher';

import { TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER } from '../resize-strategy';

export const TABLE_PROVIDERS: Provider[] = [
  ColumnResizeNotifier,
  HeaderRowEventDispatcher,
  ColumnResizeNotifierSource,
  TABLE_LAYOUT_FIXED_RESIZE_STRATEGY_PROVIDER,
];

export const TABLE_HOST_BINDINGS = {
  'class': 'mat-column-resize-table',
};
