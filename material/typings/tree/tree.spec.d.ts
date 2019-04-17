import { BehaviorSubject } from 'rxjs';
export declare class TestData {
    pizzaTopping: string;
    pizzaCheese: string;
    pizzaBase: string;
    level: number;
    children: TestData[];
    observableChildren: BehaviorSubject<TestData[]>;
    isSpecial: boolean;
    constructor(pizzaTopping: string, pizzaCheese: string, pizzaBase: string, children?: TestData[], isSpecial?: boolean);
}
