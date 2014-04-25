module Collections {
    export class Pair<T1, T2> extends BaseObject {
        public constructor(public Value1: T1, public Value2: T2) { super(); }
    }
    export class Tuple<T1, T2, T3> extends BaseObject {
        public constructor(public Value1: T1, public Value2: T2, public Value3: T3) { super(); }
    }
    export class Quadruple<T1, T2, T3, T4> extends BaseObject {
        public constructor(public Value1: T1, public Value2: T2, public Value3: T3, public Value4: T4) { super(); }
    }
    export class Pentuple<T1, T2, T3, T4, T5> extends BaseObject {
        public constructor(public Value1: T1, public Value2: T2, public Value3: T3, public Value4: T4, public Value5: T5) { super(); }
    }
}