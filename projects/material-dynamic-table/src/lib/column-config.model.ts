export class ColumnConfig {
    name?: string;
    displayName?: string;
    type: string;
    options?: any;
    sticky?: string;
    sort?: boolean;
    //navigationUrl?: (inputRow: any) => string
    navFunction?: (row: any) => unknown;
}