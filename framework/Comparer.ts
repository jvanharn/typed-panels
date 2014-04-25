interface IComparer<T> {
    Compare(a: T, b: T): number;
}

interface IComparable<TExtending extends IComparable<any>> {
    Compare(comparable: TExtending): number;
}