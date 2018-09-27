import { ColumnConfig } from '../../column-config.model';

export interface CellComponent {
    column: ColumnConfig;
    row: object;
}