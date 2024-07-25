export class ColumnConfig {
    name: string;
    displayName?: string;
    type: string;
    options?: any;
    sticky?: string;
    sort?: boolean;
    hint?: string;
    resizable?: boolean | { minWidth?: number, maxWidth?: number };
}
