interface IEqualityComparer<T> extends IHashable {
    Equals(a: T, b: T): boolean;
}

interface IEqualityComparable<TExtending> extends IHashable {
    Equals(comparable: TExtending): boolean;
}