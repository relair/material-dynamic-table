/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  ElementRef,
  Inject,
  Injector,
  NgZone,
  ViewContainerRef,
  ChangeDetectorRef,
  Type
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { CdkColumnDef, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER } from '@angular/cdk/table';
import { ColumnResize } from '../column-resize';
import { ColumnResizeNotifierSource } from '../column-resize-notifier';
import { ResizeStrategy } from '../resize-strategy';
import { HeaderRowEventDispatcher } from '../event-dispatcher';

import { Resizable } from '../resizable';
import { MatColumnResizeOverlayHandle } from '../overlay-handle';

/**
 * Explicitly enables column resizing for a mat-header-cell.
 */
@Directive({
  selector: 'mat-header-cell[resizable], th[mat-header-cell][resizable]',
  host: { 'class': 'mat-resizable' },
  inputs: [
    { name: 'settings', alias: 'resizable' },
  ],
  standalone: true,
})
export class MatResizable extends Resizable<MatColumnResizeOverlayHandle> {
  protected readonly document: Document;

  override minWidthPxInternal = 32;

  constructor(
    protected readonly columnDef: CdkColumnDef,
    protected readonly columnResize: ColumnResize,
    protected readonly directionality: Directionality,
    @Inject(DOCUMENT) document: any,
    protected readonly elementRef: ElementRef,
    protected readonly eventDispatcher: HeaderRowEventDispatcher,
    protected readonly injector: Injector,
    protected readonly ngZone: NgZone,
    protected readonly overlay: Overlay,
    protected readonly resizeNotifier: ColumnResizeNotifierSource,
    protected readonly resizeStrategy: ResizeStrategy,
    @Inject(_COALESCED_STYLE_SCHEDULER)
    protected readonly styleScheduler: _CoalescedStyleScheduler,
    protected readonly viewContainerRef: ViewContainerRef,
    protected readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super();
    this.document = document;
  }

  protected override getInlineHandleCssClassName(): string {
    return 'mat-resizable-handle';
  }

  protected override getOverlayHandleComponentType(): Type<MatColumnResizeOverlayHandle> {
    return MatColumnResizeOverlayHandle;
  }
}
