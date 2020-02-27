import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[mdtCellHost]',
})
export class CellDirective {
    constructor(public viewContainerRef: ViewContainerRef) {}
}