import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { TextFilter } from './text-filter.model';
import { ColumnFilter } from 'material-dynamic-table';

@Component({
    selector: 'ld-text-filter',
    templateUrl: './text-filter.component.html'
})
export class TextFilterComponent implements OnInit {

    model: TextFilter;

    displayName: string | undefined;

    public constructor(
        private readonly dialogRef: MatDialogRef<TextFilterComponent>,
        @Inject(MAT_DIALOG_DATA) private readonly filterData: ColumnFilter) { }

    ngOnInit() {
        this.displayName = this.filterData.column.displayName;
        this.model = this.filterData.filter || new TextFilter(this.filterData.column.name);
    }

    apply() {
        if (this.model.value) {
            this.dialogRef.close(this.model);
        } else {
            this.dialogRef.close('');
        }
    }
}