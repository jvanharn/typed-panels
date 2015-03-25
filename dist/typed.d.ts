/// <reference path="../defs/jquery.d.ts" />
/// <reference path="../defs/lodash.d.ts" />
interface IHashable {
    GetHashCode(): number;
}
interface ConstructorPrototype extends ObjectPrototype {
    caller: string;
    length: number;
    arguments: any[];
    name: string;
    prototype: ObjectPrototype;
    apply(object: any, args: any): void;
    bind(what: any): Function;
    call(...any: any[]): void;
}
interface ObjectPrototype {
    constructor: ConstructorPrototype;
    hasOwnProperty(): boolean;
    isPrototypeOf(): boolean;
    propertyIsEnumerable(): boolean;
    toLocaleString(): string;
    toString(): string;
    valueOf(): string;
}
/**
 * Simple object that all framework objects derive of.
 */
declare class BaseObject {
    /**
     * Simple cast method
     */
    Cast<TCast>(): TCast;
    /**
     * Get the typename of the current object
     */
    GetType(): ObjectType;
}
declare class HashableObject extends BaseObject implements IHashable {
    private static _instanceCount;
    private _objectHash;
    constructor();
    /**
     * Get a unique hashcode for the given object in the form of a number.
     */
    GetHashCode(): number;
}
/**
 * Provides information about an object/class/prototype.
 */
declare class ObjectType {
    private objPrototype;
    Name: string;
    ModuleName: string;
    FullName: string;
    IsAbstract: boolean;
    constructor(objPrototype: ConstructorPrototype);
    GetOwnProperties(): string[];
    GetProperties(): string[];
    GetMethods(): string[];
}
declare function applyTrait(targetClass: any, traits: any[]): void;
interface IComparer<T> {
    Compare(a: T, b: T): number;
}
interface IComparable<TExtending extends IComparable<any>> {
    Compare(comparable: TExtending): number;
}
interface IEqualityComparer<T> extends IHashable {
    Equals(a: T, b: T): boolean;
}
interface IEqualityComparable<TExtending> extends IHashable {
    Equals(comparable: TExtending): boolean;
}
declare class Exception implements Error {
    name: string;
    message: string;
    constructor(message?: string);
    static IgnoreOrDefault<T>(obj: any, callback: Function, def: T, ...args: any[]): T;
    static IgnoreAll(obj: any, callback: Function, ...args: any[]): void;
    static Ignore(callback: () => void): void;
}
declare class RuntimeException extends Exception {
    name: string;
    message: string;
    constructor(message?: string);
    toString(): string;
}
declare class NotImplementedException extends RuntimeException {
    name: string;
}
declare class AbstractMethodException extends NotImplementedException {
    name: string;
    message: string;
}
declare class MethodNotOverwrittenException extends NotImplementedException {
    name: string;
    message: string;
}
declare class MethodNotAccessibleException extends RuntimeException {
    name: string;
}
declare class NullReferenceException extends RuntimeException {
    name: string;
    message: string;
}
declare class InvalidArgumentException extends RuntimeException {
    name: string;
    message: string;
}
declare class KeyNotFoundException extends InvalidArgumentException {
    name: string;
    message: string;
}
declare class IndexOutOfBoundsException extends InvalidArgumentException {
    name: string;
    message: string;
}
declare class DuplicateKeyException extends InvalidArgumentException {
    name: string;
    message: string;
}
declare class Guid extends BaseObject {
    private _guid;
    constructor(_guid: string);
    CompareTo(guid: Guid): number;
    toString(): string;
    static NewGuid(): Guid;
}
/**
 * Generates templates and stores the compiled versions of them.
 * @static
 */
declare class TemplateFactory {
    static ViewBasePath: string;
    static Templates: {
        [name: string]: _.TemplateExecutor;
    };
    static WithTemplate(name: string, callback: (tpl: _.TemplateExecutor) => void): void;
    static GetTemplate(name: string): _.TemplateExecutor;
}
declare module Collections {
    interface IEnumerable<T> {
        GetEnumerator(): IEnumerator<T>;
    }
    interface IEnumerator<T> {
        Current: T;
        MoveNext(): boolean;
        Reset(): void;
        IsValid(): boolean;
        HasNext(): boolean;
    }
    class SimpleEnumerator<T> implements IEnumerator<T> {
        Index: number;
        private Items;
        Current: T;
        constructor(items: T[]);
        MoveNext(): boolean;
        HasNext(): boolean;
        IsValid(): boolean;
        Reset(): void;
    }
}
declare module Collections {
    interface ICollection<T> extends IEnumerable<T> {
        Count: number;
        Add(item: T): void;
        Clear(): void;
        Contains(item: T): boolean;
        Remove(item: T): void;
        CopyTo(collection: ICollection<T>): void;
        GetNative(): any;
    }
}
declare module Collections {
    class Pair<T1, T2> extends BaseObject {
        Value1: T1;
        Value2: T2;
        constructor(Value1: T1, Value2: T2);
    }
    class Tuple<T1, T2, T3> extends BaseObject {
        Value1: T1;
        Value2: T2;
        Value3: T3;
        constructor(Value1: T1, Value2: T2, Value3: T3);
    }
    class Quadruple<T1, T2, T3, T4> extends BaseObject {
        Value1: T1;
        Value2: T2;
        Value3: T3;
        Value4: T4;
        constructor(Value1: T1, Value2: T2, Value3: T3, Value4: T4);
    }
    class Pentuple<T1, T2, T3, T4, T5> extends BaseObject {
        Value1: T1;
        Value2: T2;
        Value3: T3;
        Value4: T4;
        Value5: T5;
        constructor(Value1: T1, Value2: T2, Value3: T3, Value4: T4, Value5: T5);
    }
}
declare module Collections {
    class ArrayHelper {
        static GetEnumerator<T>(arr: Array<T>): IEnumerator<T>;
    }
}
declare module Collections {
    interface IEnumerable<T> {
        /**
         * Loop over the items in this enumerable.
         */
        Each(callback: (item: T) => void): void;
        /**
         * Iterate over all items in this enumerable with the psoibility to stop iteration halfway.
         */
        BreakableEach(callback: (item: T, e: IEnumerator<T>) => boolean): void;
        /**
         * Check whether any of the elements in this enumerable return true for the given predictate.
         * Returns false for empty collections.
         */
        Any(predictate: (item: T) => boolean): boolean;
        /**
         * Check whether all items in this enumerable return true for the given predictate.
         * Returns true for empty collections.
         */
        All(predictate: (item: T) => boolean): boolean;
        /**
         * Check if this enumeration contains an element inside another element.
         */
        ContainsDeep<TItem>(item: TItem, extractor: (item: T) => TItem): boolean;
        /**
         * Take all elements that adhere to the predictate.
         */
        Where(predictate: (item: T) => boolean): Enumerable<T>;
        /**
         * Convert the elements of this collection into another form/type.
         */
        Select<TResult>(predictate: (item: T) => TResult): Enumerable<TResult>;
        /**
         * Sort the given enumerable by selecting the key to use for the ordering.
         */
        OrderBy<TElement, TKey>(keySelector: (item: TElement) => TKey): OrderedEnumerable<TElement>;
        /**
         * Sort the given enumerable by selecting the key to use for sorting and a comparator for the item comparison.
         */
        OrderBy<TElement, TKey>(keySelector: (item: TElement) => TKey, comparer: (leftItem: TKey, rightItem: TKey) => number): OrderedEnumerable<TElement>;
        /**
         * Group the elements in this collection into different keys.
         */
        GroupBy<TKey, TResult>(keySelector: (item: T) => TKey, resultSelector: (key: TKey, items: IEnumerable<T>) => TResult): Enumerable<TResult>;
        /**
         * Remove duplicates in this collection.
         * Warning: Very CPU heavy.
         */
        Distinct(): IEnumerable<T>;
        /**
         * Take all elements from the collection except for those in the given collection.
         */
        Except(collection: ICollection<T>): IEnumerable<T>;
        /**
         * Get the first element that adheres to the predictate or throw an exception if none exsists.
         */
        First(predictate?: (item: T) => boolean): T;
        /**
         * Get the first element that adheres to the predictate or a default value.
         */
        FirstOrDefault(def: T, predictate?: (item: T) => boolean): T;
        Last(predictate?: (item: T) => boolean): T;
        LastOrDefault(def: T, predictate?: (item: T) => boolean): T;
        ElementAt(index: number): T;
        ElementAtOrDefault(index: number): T;
        IndexOfFirst(predictate: (item: T) => boolean): number;
        Min(extractor?: (item: T) => number): T;
        Max(extractor?: (item: T) => number): T;
        CountAll(predictate?: (item: T) => boolean): number;
        /**
         * Convert this enumerable to a List.
         */
        ToList(): List<T>;
        /**
         * Convert this enumerable to a native JS Array.
         */
        ToArray(): T[];
        /**
         * Convert this enumerable to a Dictionary.
         */
        ToDictionary<TKey, TValue>(keyExtractor: (item: T) => TKey, valueExtractor: (item: T) => TValue, dict?: IDictionary<TKey, TValue>): IDictionary<TKey, TValue>;
    }
    /**
     * Simple and fast Linq extensions
     */
    class Enumerable<T> implements IEnumerable<T> {
        Each(callback: (item: T) => void): void;
        BreakableEach(callback: (item: T, e: IEnumerator<T>) => boolean): void;
        /**
         * Check whether any of the elements in this enumerable return true for the given predictate.
         * Returns false for empty collections.
         */
        Any(predictate: (item: T) => boolean): boolean;
        /**
         * Check whether all items in this enumerable return true for the given predictate.
         * Returns true for empty collections.
         */
        All(predictate: (item: T) => boolean): boolean;
        ContainsDeep<TItem>(item: TItem, extractor: (item: T) => TItem): boolean;
        Where(predictate: (item: T) => boolean): Enumerable<T>;
        Select<TResult>(predictate: (item: T) => TResult): Enumerable<TResult>;
        OrderBy<TKey>(keySelector: (item: T) => TKey, comparer?: (leftItem: TKey, rightItem: TKey) => number): OrderedEnumerable<T>;
        GroupBy<TKey, TResult>(keySelector: (item: T) => TKey, resultSelector: (key: TKey, items: IEnumerable<T>) => TResult): Enumerable<TResult>;
        Distinct(): IEnumerable<T>;
        Except(collection: ICollection<T>): IEnumerable<T>;
        First(predictate?: (item: T) => boolean): T;
        FirstOrDefault(def: T, predictate?: (item: T) => boolean): T;
        Last(predictate?: (item: T) => boolean): T;
        LastOrDefault(def: T, predictate?: (item: T) => boolean): T;
        ElementAt(index: number): T;
        ElementAtOrDefault(index: number): T;
        IndexOfFirst(predictate: (item: T) => boolean): number;
        Min(extractor?: (item: T) => number): T;
        Max(extractor?: (item: T) => number): T;
        CountAll(predictate?: (item: T) => boolean): number;
        ToList(): List<T>;
        ToArray(): T[];
        ToDictionary<TKey, TValue>(keyExtractor: (item: T) => TKey, valueExtractor: (item: T) => TValue, dict?: IDictionary<TKey, TValue>): IDictionary<TKey, TValue>;
        static CopyToArray<TValue>(e: IEnumerable<TValue>): TValue[];
        static EnumerateToArray<TValue>(e: IEnumerator<TValue>): TValue[];
        GetEnumerator(): IEnumerator<T>;
    }
    interface ICollection<T> extends IEnumerable<T> {
        RemoveAll(predictate: (item: T) => boolean): number;
        RemoveFirst(predictate: (item: T) => boolean): void;
    }
    class Collection<T> extends Enumerable<T> implements ICollection<T> {
        Count: number;
        Add(item: T): void;
        Clear(): void;
        Contains(item: T): boolean;
        Remove(item: T): void;
        CopyTo(collection: ICollection<T>): void;
        GetNative(): any;
        /**
         * Remove all items in this collection that satisfy the given predictate.
         */
        RemoveAll(predictate: (item: T) => boolean): number;
        /**
         * Remove the first item that satisfies the given predictate.
         */
        RemoveFirst(predictate: (item: T) => boolean): void;
    }
    interface IOrderedEnumerable<T> extends IEnumerable<T> {
    }
    class OrderedEnumerable<T> extends Enumerable<T> implements IOrderedEnumerable<T> {
        private Items;
        Count: number;
        constructor(Items: T[]);
        GetEnumerator(): IEnumerator<T>;
        GetNative(): any;
    }
}
declare module Collections {
    interface IList<T> extends ICollection<T> {
        ElementAt(index: number): T;
        AddRange(collection: IEnumerable<T>): void;
        IndexOf(item: T): number;
        Insert(index: number, item: T): void;
        InsertRange(index: number, collection: IEnumerable<T>): void;
        RemoveAt(index: number): void;
        RemoveRange(index: number, count: number): void;
    }
    /**
     * Real standalone list implementation.
     */
    class List<T> extends Collection<T> implements IList<T> {
        private _length;
        Count: number;
        Add(item: T): void;
        AddRange(collection: IEnumerable<T>): void;
        Remove(item: T): void;
        Clear(): void;
        Contains(item: T): boolean;
        IndexOf(item: T): number;
        ElementAt(index: number): T;
        Insert(index: number, item: T): void;
        InsertRange(index: number, collection: IEnumerable<T>): void;
        RemoveAt(index: number): void;
        RemoveRange(index: number, count: number): void;
        MoveElementTo(indexFrom: number, indexTo: number): void;
        CopyTo(collection: ICollection<T>): void;
        GetEnumerator(): IEnumerator<T>;
        /**
         * This is a native (It is natively implemented as an object) so this just returns this object :)
         */
        GetNative(): any;
        /**
         * This makes sure that there are no gaps between indices after altering the elements in a list.
         */
        protected _fixIndex(): void;
        protected _removeGap(gapStart: number, gapEnd: number): number;
        protected _makeGap(gapStart: number, gapLength: number): void;
    }
    class ListEnumerator<T> implements IEnumerator<T> {
        Index: number;
        private List;
        Current: T;
        constructor(list: List<T>);
        MoveNext(): boolean;
        HasNext(): boolean;
        IsValid(): boolean;
        Reset(): void;
    }
}
declare module Collections {
    interface IDictionary<TKey, TValue> extends ICollection<KeyValuePair<TKey, TValue>> {
        Count: number;
        Keys: TKey[];
        Values: TValue[];
        Set(key: TKey, value: TValue): void;
        ContainsKey(key: TKey): boolean;
        Remove(key: TKey): void;
        Remove(obj: any): void;
        Get(key: TKey): TValue;
        GetKey(value: TValue): TKey;
    }
    interface IDictionaryEnumerator<TKey, TValue> extends IEnumerator<KeyValuePair<TKey, TValue>> {
        Index: number;
        Key: TKey;
        Value: TValue;
    }
    class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
        private Items;
        Count: number;
        Keys: TKey[];
        Values: TValue[];
        Get(key: TKey): TValue;
        Set(key: TKey, value: TValue): void;
        Add(item: KeyValuePair<TKey, TValue>): void;
        GetKey(value: TValue): TKey;
        Clear(): void;
        Contains(item: KeyValuePair<TKey, TValue>): boolean;
        ContainsKey(key: TKey): boolean;
        Remove(item: KeyValuePair<TKey, TValue>): void;
        Remove(key: TKey): void;
        CopyTo(collection: ICollection<KeyValuePair<TKey, TValue>>): void;
        GetNative(): any;
        GetEnumerator(): IDictionaryEnumerator<TKey, TValue>;
    }
    class KeyValuePair<TKey, TValue> {
        Key: TKey;
        Value: TValue;
        constructor(Key: TKey, Value: TValue);
    }
    class DictionaryEnumerator<TKey, TValue> implements IDictionaryEnumerator<TKey, TValue> {
        private _index;
        private Items;
        Key: TKey;
        Value: TValue;
        Index: number;
        Current: KeyValuePair<TKey, TValue>;
        constructor(items: KeyValuePair<TKey, TValue>[]);
        MoveNext(): boolean;
        Reset(): void;
        HasNext(): boolean;
        IsValid(): boolean;
        private RefreshCurrent();
    }
}
declare module Collections {
    module Specialized {
        /**
         * More limited in what it can store than a storage dictionary but much faster due to it's use of native arrays and thu faster when using direct acces, but still has all the extended properties.
         */
        class StringDictionary<TValue> extends Collection<KeyValuePair<string, TValue>> implements IDictionary<string, TValue> {
            _count: number;
            Items: {
                [name: string]: TValue;
            };
            Count: number;
            Keys: string[];
            Values: TValue[];
            Get(key: string): TValue;
            Set(key: string, value: TValue): void;
            Add(item: KeyValuePair<string, TValue>): void;
            GetKey(value: TValue): string;
            Clear(): void;
            Contains(item: KeyValuePair<string, TValue>): boolean;
            ContainsKey(key: string): boolean;
            Remove(item: KeyValuePair<string, TValue>): void;
            Remove(key: string): void;
            CopyTo(collection: ICollection<KeyValuePair<string, TValue>>): void;
            GetNative(): any;
            GetEnumerator(): IDictionaryEnumerator<string, TValue>;
        }
        /**
         * Optimized iterator for searchdictionary
         */
        class StringDictionaryEnumerator<TValue> implements IDictionaryEnumerator<string, TValue> {
            private _index;
            private Keys;
            private Items;
            Key: string;
            Value: TValue;
            Index: number;
            Current: KeyValuePair<string, TValue>;
            constructor(items: {
                [name: string]: TValue;
            });
            MoveNext(): boolean;
            Reset(): void;
            HasNext(): boolean;
            IsValid(): boolean;
            private RefreshCurrent();
        }
    }
}
declare module Collections {
    module Specialized {
        /**
         * List implementation based on a native JS Array.
         */
        class ArrayList<T> extends Collection<T> implements IList<T> {
            /**
             * @access protected
             */
            Items: T[];
            Count: number;
            Add(item: T): void;
            AddRange(collection: IEnumerable<T>): void;
            Remove(item: T): void;
            RemoveRange(index: number, count: number): void;
            Clear(): void;
            Contains(item: T): boolean;
            IndexOf(item: T): number;
            ElementAt(index: number): T;
            Insert(index: number, item: T): void;
            InsertRange(index: number, collection: IEnumerable<T>): void;
            RemoveAt(index: number): void;
            CopyTo(collection: ICollection<T>): void;
            GetEnumerator(): IEnumerator<T>;
            GetNative(): any;
        }
    }
}
declare module Events {
    /**
     * Dispatches events to event listeners.
     */
    interface IEventDispatcher {
        /**
         * Trigger an object event.
         */
        Dispatch(eventName: string, event: IObjectEvent<IEventDispatcher>): void;
        /**
         * Attach an event consumer object
         */
        Consume(consumer: IEventConsumer, events?: string[]): void;
        /**
         * Remove an event consumer object
         */
        Starve(consumer: IEventConsumer, events?: string[]): void;
        /**
         * Register a single callback for a single event
         */
        Attach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
        /**
         * Remove an attached event
         */
        Detach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
        /**
         * Shorthand for Attach, use exectly like the jQuery exuivalent
         */
        On(eventNames: string, callback: (event: IObjectEvent<IEventDispatcher>) => void): void;
        /**
         * Stop the current event cycle from bubbling further down the attached events.
         */
        StopCurrentEventPropagation(): void;
    }
    /**
     * Listens to IEventDispatcher
     */
    interface IEventConsumer {
        ConsumeEvent(event: IObjectEvent<IEventDispatcher>): void;
    }
    /**
     * Generic event
     */
    interface IObjectEvent<TObject extends IEventDispatcher> {
        EventName: string;
        OriginatingObject: TObject;
        StopPropagation(): void;
    }
    /**
     * Simple Implementation, only works with EventDispatcher extending objects
     */
    class ObjectEvent<TEventDispatcher extends IEventDispatcher> implements IObjectEvent<TEventDispatcher> {
        private _originatingObject;
        private _eventName;
        private _data;
        constructor(_originatingObject: TEventDispatcher, _eventName: string, _data?: any);
        EventName: string;
        OriginatingObject: TEventDispatcher;
        Data: any;
        StopPropagation(): void;
    }
    /**
     * Basic Implementation of an IEventDispatcher
     * @abstract
     */
    class EventDispatcher extends BaseObject implements IEventDispatcher {
        static WildcardEvent: string;
        EventConsumers: Collections.Dictionary<string, Collections.List<IEventConsumer>>;
        EventDelegates: Collections.Dictionary<string, Collections.List<(event: IObjectEvent<IEventDispatcher>) => void>>;
        PropagationCanceled: boolean;
        /**
         * Trigger an object event.
         */
        Dispatch(eventName: string, event: IObjectEvent<IEventDispatcher>): void;
        /**
         * Add consumer
         */
        Consume(consumer: IEventConsumer, events?: string[]): void;
        /**
         * Remove consumer
         */
        Starve(consumer: IEventConsumer, events?: string[]): void;
        /**
         * Register a single callback for a single event
         */
        Attach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
        /**
         * Remove an attached event
         */
        Detach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
        /**
         * Shorthand for Attach, use exectly like the jQuery exuivalent
         * Eventnames is a space separated list of events to bind.
         */
        On(eventNames: string, callback: (event: IObjectEvent<IEventDispatcher>) => void): void;
        /**
         * Stop the current event cycle from bubling further down the attached events.
         */
        StopCurrentEventPropagation(): void;
    }
    /**
     * Copies the Event Dispatcher methods to the class, so we can work around the single inheritance limitation.
     * IMPOTANT!: Also call this.InitEventSystem() in the constructor.
     */
    function CopyEventDispatcherPrototype(eventDispatcherImpl: Function): void;
}
declare module Model {
    interface ViewModelOptions {
        identityProperty?: string;
        readOnly?: boolean;
        requestData?: {};
        responseMapCallback?: (jsonObject: {}, xhr: JQueryXHR) => ViewModelResponseMapResult;
    }
    interface ViewModelResponseMapResult {
        result: {
            [name: string]: any;
        };
        message?: string;
        errorCode?: number;
    }
    /**
     * Direction in which the synchronisation happened (if server synchronisation happened).
     */
    enum ModelEventSyncDirection {
        /**
         * Default direction if no server interaction occurred.
         */
        Local = 0,
        /**
         * Read the model from the Server. (E.g. initial GET request.)
         */
        Read = 1,
        /**
         * Write the model to the server. (E.g. POST when the model didn't yet exist)
         */
        Write = 2,
        /**
         * Update an existing server model (PUT, PATCH etc.)
         */
        Update = 3,
    }
    interface ModelEventPropertyScope {
        propertyName: string;
        previousValue?: any;
        currentValue: any;
    }
    /**
     * Model event representing a change in the model.
     */
    class ModelEvent<TModel extends ViewModel<any>> implements Events.IObjectEvent<TModel> {
        private _originatingObject;
        private _eventName;
        private _direction;
        private _scope;
        private _resultMessage;
        private _resultCode;
        constructor(_originatingObject: TModel, _eventName: string, _direction: ModelEventSyncDirection, _scope?: ModelEventPropertyScope, _resultMessage?: string, _resultCode?: number);
        /**
         * The name of the event that occurred.
         */
        EventName: string;
        /**
         * The model instance that send this event.
         */
        OriginatingObject: TModel;
        /**
         * The direction of the synchronisation or ModelEventSyncDirection.Local otherwise.
         */
        Direction: ModelEventSyncDirection;
        /**
         * The scope of the model event (e.g. one property or the entire model). null means all properties were changed/the whole object was updated.
         */
        Scope: ModelEventPropertyScope;
        /**
         * The result message of the server sync (If it occurred)
         */
        ResultMessage: string;
        /**
         * The result message of the server sync (If it occurred)
         */
        ResultCode: number;
        /**
         * Stop the event from propagating to other event handlers.
         */
        StopPropagation(): void;
    }
    /**
     * Lazy loading view-model
     */
    class ViewModel<TModel> extends Events.EventDispatcher {
        private _modelAttributes;
        private _modelValues;
        private _modelDefaults;
        private _modelUrl;
        private _options;
        private _hasFetched;
        /**
         * Create a new lazy loading view model.
         * @param url
         * @param options
         * @constructor
         */
        constructor(url: string, options?: ViewModelOptions);
        /**
         * Iterates over all user added properties and changes them to dynamic getters and setters, so sync and save are no longer required.
         * This is pretty cool stuff :)
         */
        RefreshModelProperties(exclusionList?: string[]): void;
        /**
         * Identifier property if any, or null (No exceptions)
         */
        GetID(): any;
        /**
         * Will not try fetch the property if it isnt fetched yet
         */
        LocalGet(name: string): any;
        /**
         * Get the property or returns undefined
         */
        Get(name: string): any;
        /**
         * Get the property or raise an exception
         */
        TryGet(name: string): any;
        /**
         * Get multiple properties when they're available
         */
        AsyncGetAttributes(attributes: string[], success: (attributes: {
            [attribute: string]: any;
        }) => void): void;
        /**
         * Set the value of an value.
         */
        Set(name: string, value: any, preventEvent?: boolean): void;
        /**
         * Fetch all data from the server for this viewmodel.
         */
        Fetch(async?: boolean, options?: ViewModelOptions, success?: (model: TModel, resultCode: number, resultMessage: string) => void): void;
        /**
         * Update or create the server side representation for this model/object.
         */
        Save(): void;
        /**
         * Synchronise the server and local representation of this object.
         *
         * If the local object is not yet loaded it will fetch the object, if the local object has no id (null id) it will try and create it, etc.
         */
        Sync(): void;
        /**
         * Gives you a plain object snapshot of the current values of the model without any event listeners etc, etc.
         * Example of usage: For lodash or underscore templates or other places where u use a "with() {}" construct.
         */
        ToObject(): any;
        private UCFirst(str);
    }
}
declare module Panels {
    /**
     * Makes the element accessors of a panel visible in intellisense.
     * Cast an panel to this interface to be able to access those elements.
     * Example: (<Panels.ProtectedPanel> <any> this)._panelElement
     * Example 2: this.Cast<ProtectedPanel>()._panelElement
     * @access private
     */
    interface ProtectedPanel {
        _panelElement: JQuery;
        _contentElement: JQuery;
    }
    interface IPanel {
        PanelName: string;
        PanelSeqId: number;
        PanelElement: JQuery;
        ContentElement: JQuery;
        Render(): void;
    }
    /**
     * Panel Object
     *
     * Represents a subset of an application interface.
     * @abstract
     */
    class Panel extends BaseObject implements IPanel {
        /**
         * Counts the number of panels currently instantiated.
         */
        private static _panelCnt;
        /**
         * The sequential/internal identifier of this panel.
         */
        private _panelId;
        /**
         * The (Given) name of this panel.
         */
        private _panelName;
        /**
         * The panels outermost element.
         */
        private _panelElement;
        /**
         * The innermost element of the panel. (For example: when the panel provides scrolbars this will be the the elment that is scrollable.)
         */
        private _contentElement;
        /**
         * Get the name of the panel.
         */
        /**
         * Set the name of this panel.
         * WARNING: Do not change the name of a panel AFTER it ha been added to a group!!
         */
        PanelName: string;
        /**
         * Get the unique identifier of this panel. (Unmodifyable)
         */
        PanelSeqId: number;
        /**
         * Get the panel's outermost element.
         *
         * Use this element to move the entire Panel through the DOM.
         */
        PanelElement: JQuery;
        /**
         * Get the panle's innermost element.
         *
         * Use this element to add/alter/remove content inside the Panel.
         */
        ContentElement: JQuery;
        /**
         * @abstract
         */
        constructor();
        /**
         * Render the panel so it will be displayed.
         */
        Render(): void;
        /**
         * This is the method the panel implementation will overwrite.
         * Please do not directly call this method unless you know what you are doing.
         * @abstract
         * @access protected
         */
        Renderer(): void;
        /**
         * Asynchronusly retrieve an template to work with.
         */
        withTemplate(name: string, callback: (tpl: _.TemplateExecutor) => void): void;
        /**
         * Synchronously retrieve an compiled template.
         */
        GetTemplate(name: string): _.TemplateExecutor;
    }
}
declare module Panels {
    /**
     * This is used as a type to establish the identity of an individual panel within the system, so that the system always knows what panel everyone is talking aout.
     * Can also be read as PanelReference
     */
    class PanelReference extends BaseObject implements IEqualityComparable<PanelReference> {
        private _panel;
        private _group;
        constructor(_panel: IPanel, _group: IViewportPanelGroup);
        /**
         * Get the css id
         */
        PanelName: string;
        /**
         * Get an unique query string that will point you to the PANEL element
         */
        QueryString: string;
        /**
         * Get the panel element wrapped in an jQuery object
         */
        OuterElement: JQuery;
        /**
         * Get the innermost element (Will be same element as the outermost element for most elements, will be different for crollable panels etc.)
         */
        InnerElement: JQuery;
        /**
         * Get whether or not the panel is currently shown in the viewport.
         */
        /**
         * Set the visibility of the element inside the viewport.
         */
        Visibility: boolean;
        /**
         * Get the group this panel is in.
         */
        Group: IViewportPanelGroup;
        /**
         * Get the panel this object references to.
         */
        Panel: IPanel;
        /**
         * Replacement for the toString builtin.
         */
        toString(): string;
        /**
         * Checks whether two references are refering to the same object.
         */
        Equals(obj: PanelReference): boolean;
        /**
         * Get an unique hashcode for the referenced panel.
         */
        GetHashCode(): number;
    }
}
declare module Panels {
    interface IPanelGroup extends IPanel {
        /**
         * Add an panel to the group.
         */
        AddPanel(panel: IPanel): void;
        /**
         * Detach a panel by it's name and get the panel object.
         */
        DetachPanel(name: string): IPanel;
        /**
         * Get a panel from the group by it's name.
         */
        GetPanel(name: string): IPanel;
        /**
         * Get a Panel of the specified type by the specified name.
         */
        GetTypedPanel<TPanel extends IPanel>(name: string): TPanel;
        /**
         * Get all panels of the given type.
         */
        GetPanelsByType(type: any): IPanel[];
        /**
         * Check if the group has a panel with the specified name.
         */
        HasPanel(name: string): boolean;
    }
    interface IViewportPanelGroup extends IPanelGroup {
        /**
         * Show a Panel by it's name.
         */
        Show(name: string): void;
        /**
         * Hide a panel by it's name.
         */
        Hide(name: string): void;
        /**
         * Check if the given named panel is visible in the group viewport.
         */
        IsVisible(name: string): boolean;
    }
    interface IReferencedViewportPanelGroup extends IViewportPanelGroup {
        /**
         * Detach a panel from this group.
         */
        DetachPanelByReference(ref: Panels.PanelReference): IPanel;
        /**
         * Check if the panel with the given name is registered with this group.
         */
        HasPanelByReference(ref: Panels.PanelReference): boolean;
        /**
         * Show a panel by its reference object.
         */
        ShowByReference(ref: Panels.PanelReference): void;
        /**
         * Hide a panel by its reference.
         */
        HideByReference(ref: Panels.PanelReference): void;
        /**
         * Check if a panel in this group is currently in the viewport.
         */
        IsVisibleByReference(ref: Panels.PanelReference): boolean;
    }
    class PanelGroup extends Panel implements IPanelGroup {
        Panels: {
            [name: string]: IPanel;
        };
        constructor();
        /**
         * Add an panel to the group.
         */
        AddPanel(panel: IPanel): void;
        /**
         * Detach the panel with the given name.
         */
        DetachPanel(name: string): IPanel;
        /**
         * Get a panel from the group by it's name.
         */
        GetPanel(name: string): IPanel;
        /**
         * Get a Panel of the specified type by the specified name.
         */
        GetTypedPanel<TPanel extends IPanel>(name: string): TPanel;
        /**
         * Get all panels of the given type.
         */
        GetPanelsByType(type: any): IPanel[];
        /**
         * Check if the group has a panel with the specified name.
         */
        HasPanel(name: string): boolean;
    }
    class PanelGroupHelper {
        /**
         * Check whether the given panel is not attached to another group.
         */
        static IsPanelAttachable(panel: IPanel): boolean;
    }
}
declare class UnknownPanelException extends KeyNotFoundException {
    name: string;
    message: string;
}
declare module Panels {
    /**
     * @abstract
     */
    class ConsumablePanel extends Panel implements Events.IEventDispatcher {
        EventConsumers: Collections.Dictionary<string, Collections.List<Events.IEventConsumer>>;
        EventDelegates: Collections.Dictionary<string, Collections.List<(event: Events.IObjectEvent<Events.IEventDispatcher>) => void>>;
        PropagationCanceled: boolean;
        /**
         * Trigger an object event.
         */
        Dispatch(eventName: string, event: Events.IObjectEvent<Events.IEventDispatcher>): void;
        /**
         * Attach an event consumer object
         */
        Consume(consumer: Events.IEventConsumer, events?: string[]): void;
        /**
         * Remove an event consumer object
         */
        Starve(consumer: Events.IEventConsumer, events?: string[]): void;
        /**
         * Register a single callback for a single event
         */
        Attach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
        /**
         * Remove an attached event
         */
        Detach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
        /**
         * Shorthand for Attach, use exectly like the jQuery exuivalent
         */
        On(eventNames: string, callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void): void;
        /**
         * Stop the current event cycle from bubbling further down the attached events.
         */
        StopCurrentEventPropagation(): void;
    }
}
declare module Panels {
    class DynamicPanel extends ConsumablePanel {
        private RendererCallback;
        constructor(RendererCallback: (contentElement: JQuery, panelElement: JQuery, context: DynamicPanel) => void);
        Render(): void;
    }
}
declare module Panels {
    module Groups {
        /**
         * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
         */
        class StackingPanelGroup extends PanelGroup implements ILiftablePanelGroup {
            Show(panelId: string): void;
            Hide(panelId: string): void;
            Render(): void;
            FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void;
        }
    }
}
declare module Panels {
    interface ILiftablePanel extends IPanel {
        FillFromElement(panelElement: JQuery, contentElement?: JQuery): void;
    }
    interface ILiftablePanelGroup extends IPanelGroup {
        /**
         * Fills the group with the given DOM data.
         * (Can/should only be called once directly after the constructor, should be disabled afterwards, unless this is unnecesserry)
         */
        FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void;
    }
    interface ILiftedPanelData {
        Panel: IPanel;
        GroupConfig: any;
    }
    /**
     * Simplest type of Panel that can be constructed from DOM.
     * Does absolutely nothing but serve as a facade to work with in the framework.
     */
    class LiftedPanel extends Panel implements ILiftablePanel {
        constructor(panelElement?: JQuery, contentElement?: JQuery);
        Renderer(): void;
        FillFromElement(panelElement: JQuery, contentElement?: JQuery): void;
    }
    enum LiftableElementState {
        NotLiftable = 0,
        Panel = 1,
        Group = 2,
    }
    class LiftablePanelHelper {
        /**
         * Data attribute that contains information about the role of the element.
         */
        static DataElementRole: string;
        /**
         * Data attribute that contains the type of group this element should be lifted as.
         */
        static DataPanelType: string;
        /**
         * Data attribute that describes the panel type to initialize the group as.
         */
        static DataGroupType: string;
        /**
         * The configuration for the panel or group itself when on a panel or group. (Constructor Params)
         * Should contain a JSON Array with constructor arguments.
         */
        static DataPanelConfig: string;
        /**
         * The configuration for the parent group when on a group or panel type. (AddPanel Params)
         * Should contain a JSON object.
         */
        static DataGroupConfig: string;
        /**
         * Overridable default panel constructor. (When no type is set.)
         */
        static DefaultPanelConstructor: (panelElement: JQuery, contentElement: JQuery, panelConfig: any) => IPanel;
        /**
         * Overridable default panelgroup constructor.
         */
        static DefaultPanelGroupConstructor: (panelElement: JQuery, contentElement: JQuery, panelConfig: any, panels: ILiftedPanelData[]) => IPanelGroup;
        /**
         * Lifts a panel from an element. (Only a single panel is supported, the first found panel element is detached from the element, the rest is ignored.)
         */
        static LiftPanelFromElement(element: JQuery): ILiftedPanelData;
        /**
         * Lifts a group from an element or a sub element. Only works on JQuery collections of length=1.
         */
        static LiftPanelGroupFromElement(element: JQuery): ILiftedPanelData;
        /**
         * Lifts all panels from the given element. Also considers the element(s) themselves.
         * @returns A panel, panelgroup or a collection of either or both.
         */
        static LiftAllFromElement(elements: JQuery): IPanel[];
        private static LiftAllWithPanelDataFromElement(element);
        /**
         * Check on a SINGLE element if it is liftable.
         */
        static IsLiftableElement(element: JQuery): LiftableElementState;
        private static ExtractPanelConfig(panelElement);
        private static ExtractContentElement(panelElement);
        /**
         * Lifts a panel from the element and returns it as the given type.
         */
        static LiftTypedPanelFromElement<TPanel extends IPanel>(element: JQuery): TPanel;
        private static LiftedPanelConstructor(panelElement, contentElement, panelName?, panelType?, panelConfig?);
        private static LiftedGroupConstructor(panelElement, contentElement, panelName?, groupType?, panelConfig?, panels?);
        private static _setPanelName<T>(obj, panelName);
        /**
         * This method does a basic copy that will be able to replace the panel elements for most panels.
         * WARNING: This method makes assumptions, it will for example not copy any attributes other thatn the id and class attributes.
         */
        static ReplacePanelElements(panel: IPanel, panelElement?: JQuery, contentElement?: JQuery): void;
        /**
         * Determines whether the object given can be used as a liftable panel .
         */
        static IsLiftablePanel(obj: Object): boolean;
        static FindElementWithRole(root: JQuery, role: string): JQuery;
        private static GetPanelObjectByString(objectPath);
        private static GetGroupObjectByString(objectPath);
        private static ResolveObjectForPath(objectPath);
    }
}
declare module Panels {
    /**
     * Panel that get's rendered from a Razor View and can have specific elements replaced/updated on specific events.
     * @abstract
     */
    class RazorPanel extends Panel implements Events.IEventConsumer {
        private _partialUrl;
        private _updateUrl;
        /**
         * Whether or not the main razor template was already loaded and rendered. (When this is true only partials are rerendered.)
         */
        private _rendered;
        /**
         * List of partial IDs that have been rendered right now.
         */
        private RenderedPartials;
        /**
         * Check whether or not the first/main renderer has already taken place.
         */
        IsRendered: boolean;
        constructor(_partialUrl: string, _updateUrl: string);
        /**
         * Determines what to render.
         */
        Render(): void;
        /**
         * Call this method to force the panel to refetch the main razor template. Use this if the partial updating went wrong, etc.
         */
        ForceRerender(): void;
        /**
         * This method is called after the rendering of every partial piece of the panel. It can be used to add click events etc.
         * @abstract
         */
        ProcessPartialRender(partialId: number, partialElement: JQuery): void;
        /**
         * Renders the main razor panel.
         * @access protected
         */
        private MainRenderer();
        /**
         * Rerenders/updates parts of the main rendered dom with partial templates.
         * @access protected
         */
        private PartialRenderer(partialId, html?);
        /**
         * Fetch the contents of a razor compiled template. Give an partialId
         */
        private FetchRazor(callback, partialId?);
        /**
         *
         */
        ConsumeEvent(event: Events.IObjectEvent<any>): void;
        /**
         * This is the event mapper. It makes it possible for you to map an non razor event to an Razor event.
         * If this method returns null it will discard/ignore the event.
         * @abstract
         */
        EventMapper(event: Events.IObjectEvent<any>): RazorPartialUpdateEvent;
    }
    class RazorPartialUpdateEvent implements Events.IObjectEvent<any> {
        private _originatingObject;
        private _eventName;
        private _partialId;
        private _partialHtml;
        constructor(_originatingObject: any, _eventName: string, _partialId: number, _partialHtml?: JQuery);
        EventName: string;
        OriginatingObject: any;
        /**
         * The Id number of an existing partial to update, or another positive number to add the element at the end or beginning.
         */
        PartialId: number;
        /**
         * Optionally provide the HTML to fill the partial with, instead of asking the server for the content
         */
        PartialHtml: JQuery;
        StopPropagation(): void;
    }
}
declare module Panels {
    interface IStatefullPanel<TState> {
        State: TState;
    }
    /**
     * Panel that requires a "state" to be able to be rendered. WHen the state changes, it is automatically rerendered.
     * An example would be a model.
     */
    class StatefullPanel<TState> extends ConsumablePanel implements IStatefullPanel<TState> {
        private _renderOnStateChange;
        private _state;
        State: TState;
        constructor(_renderOnStateChange: boolean);
    }
    /**
     * Statefull panel that can have a ViewModel as state object.
     */
    class ModelPanel<TModel extends Model.ViewModel<any>> extends ConsumablePanel implements IStatefullPanel<TModel> {
        private _renderOnStateChange;
        private _state;
        State: TModel;
        constructor(_renderOnStateChange: boolean, viewModel: TModel);
        /**
         * Render the current state object using the given template.
         */
        RenderModel(templateName: string, async?: boolean): void;
    }
}
declare module Panels {
    /**
     * Panel that get's rendered only once, and only when needed based on a unfetched model. (That only get's fetched when the actal render method is called or the content element is retrieved or the model is fetched.)
     * @abstract
     */
    class StatelessPanel<TState extends Model.ViewModel<any>> extends Panel {
        private _rendered;
        private _state;
        /**
         * Get the current state of the object.
         */
        /**
         * @access private
         */
        State: TState;
        /**
         * Check whether this class has already been rendered.
         */
        IsRendered: boolean;
        /**
         * Get the innermost element of the panel.
         */
        ContentElement: JQuery;
        constructor(model: TState);
        /**
         * Calls the deferred renderer only once.
         */
        Render(): void;
        /**
         * This is the deferred renderer function.
         * Implement it to use this abstract class.
         * @abstract
         */
        StateRenderer(): void;
    }
}
declare module Panels {
    module Viewport {
        interface PanelViewportState {
            /**
             * Whether or not the current panel is visible.
             */
            Visibility: boolean;
            /**
             * Reference to the Panel object.
             */
            Reference: Panels.PanelReference;
            /**
             * Numeric representation of the position of this element.
             */
            Position: number;
        }
        interface PanelViewportStateChange extends PanelViewportState {
            /**
             * Whether or not any changes to this panels visibility or position where made anyway. (Can be used as shortcut)
             */
            Changed: boolean;
            /**
             * The previous visibility.
             */
            PreviousVisibility: boolean;
            /**
             * The old position of the Element.
             */
            PreviousPosition: number;
            /**
             * (Optional) The direction in which the element has to be animated.
             */
            AnimationDirection: Side;
        }
        /**
         * Defines the orientation of an axisbound operation.
         */
        enum Orientation {
            Horizontal = 0,
            Vertical = 1,
        }
        /**
         * Defines the side towards which a Direction is aimed.
         */
        enum Side {
            Left = 0,
            Right = 1,
            Top = 2,
            Down = 3,
        }
        /**
         * Viewport Manager Interface
         */
        interface IViewportManager {
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            SetElement(viewportElement: JQuery): void;
            /**
             * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
             */
            Attach(ref: Panels.PanelReference): void;
            /**
             * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
             */
            Detach(ref: Panels.PanelReference): void;
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             */
            IsAttached(ref: Panels.PanelReference): boolean;
            /**
             * Arrange the given panels in the viewport.
             * @param arrangement The panels and their position and visibility in the viewport.
             */
            Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>): void;
            /**
             * Arrange the given panels in the viewport for the initial panel setup.
             * @param arrangement The panels and their position and visibility in the viewport.
             */
            ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
        }
    }
}
declare module Panels {
    module Utils {
        /**
         * INTERNAL CLASS
         * Used for easily managing references and reordering them in place.
         * @access protected
         */
        class ReferenceManager extends BaseObject {
            private maximalVisibleCount;
            private References;
            constructor(maximalVisibleCount?: number);
            EachRef(callback: (ref: Panels.PanelReference, visibility: boolean) => void): void;
            AttachRef(ref: Panels.PanelReference): void;
            DetachRef(ref: Panels.PanelReference): void;
            HasRef(ref: Panels.PanelReference): boolean;
            HasRefByName(name: string): boolean;
            GetRefByName(name: string): Panels.PanelReference;
            GetRefsByPanelType<TPanel extends IPanel>(type: any): TPanel[];
            PositionOfRef(ref: Panels.PanelReference): number;
            /**
             * Move the given element one place back in the list.
             */
            MoveBack(ref: Panels.PanelReference): void;
            /**
             * Move the given element one place forward in the list.
             */
            MoveForward(ref: Panels.PanelReference): void;
            /**
             * Move the given ref to the given index.
             */
            MoveTo(ref: Panels.PanelReference, index: number): void;
            /**
             * Get all panels that are visible in the viewport.
             */
            GetVisible(): Collections.List<Panels.PanelReference>;
            /**
             * Check if a panel is visible or not.
             */
            IsVisible(ref: Panels.PanelReference): boolean;
            SetVisibility(ref: Panels.PanelReference, visibility: boolean): void;
            SetVisibilityAll(visibility: boolean): void;
            GetCurrentState(): Collections.Enumerable<Panels.Viewport.PanelViewportState>;
            /**
             * Iterate over all panels in the dictionary returning an array with the corrected order and how each reference was mutated.
             * @return <Panel, Direction of animation, Places Moved, oldVisibility>
             */
            TrackChanges(callback: () => void, animationDirectionCallback?: (stateChange: Panels.Viewport.PanelViewportStateChange) => void): Collections.Enumerable<Panels.Viewport.PanelViewportStateChange>;
        }
    }
}
declare module Panels {
    module Viewport {
        /**
         * Viewport Manager that tiles the panels horizontally OR vertically.
         * Has animations.
         */
        class TilingViewportManager implements IViewportManager {
            ViewportOrientation: Orientation;
            AnimateInitialState: boolean;
            static ViewportClassHorizontal: string;
            static ViewportClassVertical: string;
            Element: JQuery;
            AnimationDuration: number;
            AnimationEasing: string;
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            constructor(ViewportOrientation?: Orientation, AnimateInitialState?: boolean);
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            SetElement(viewportElement: JQuery): void;
            /**
             * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
             */
            Attach(ref: Panels.PanelReference): void;
            /**
             * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
             */
            Detach(ref: Panels.PanelReference): void;
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             */
            IsAttached(ref: Panels.PanelReference): boolean;
            /**
             * Arrange the given panels in the viewport according to the given orientation.
             */
            Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>, initial?: boolean): void;
            /**
             * Arrange the given panels in the viewport for the initial panel setup.
             * @param arrangement The panels and their position and visibility in the viewport.
             */
            ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
        }
    }
}
declare module Panels {
    module Viewport {
        module Composition {
            class TilingViewportComposition implements Panels.Viewport.IViewportComposition {
                /**
                 * The orientation of this composition. Must be settable and gettable.
                 *
                 * If changed for a composing run, will always be set first. Ergo, this will be set to the changed value, and compose will be called afterwards.
                 * The composition is allowed to not accept orientation changes, and must then fire a ViewportOrientationChangeException.
                 */
                Orientation: Panels.Viewport.Orientation;
                /**
                 * Decides the order and size of panels in a viewport.
                 * @param panels The panels from the group that have to be composed
                 * @param initialOrdering Whether or not this is the first time the composition is being made for the current Group.
                 * @return A collection of viewport state changes that have to be made to the viewport, in order to reach the desired composition for this type of ViewportComposition.
                 */
                Compose(panels: Collections.Enumerable<ComposedPanelViewportState>, initialOrdering?: boolean): Collections.Enumerable<ComposedPanelViewportStateChange>;
            }
        }
    }
}
declare module Panels {
    module Viewport {
        interface ComposedPanelViewportState extends PanelViewportState {
            /**
             * The size of this Panel in the composition.
             *
             * Floating point percentage; 1.00 = 100% in size, 0.12 = 12% in size. Width or height, depends on the orientation.
             * If not set defaults to (1.00 / totalNumberOfPanels)
             */
            Size: number;
        }
        interface ComposedPanelViewportStateChange extends PanelViewportStateChange, ComposedPanelViewportState {
            /**
             * The previous size of this Panel in the composition, before it was changed.
             *
             * The same as Size if unchanged. Also detectable by the Changed boolean.
             * Floating point percentage; 1.00 = 100% in size, 0.12 = 12% in size. Width or height, depends on the orientation.
             */
            PreviousSize: number;
        }
        interface IViewportComposition {
            /**
             * The orientation of this composition. Must be settable and gettable.
             *
             * If changed for a composing run, will always be set first. Ergo, this will be set to the changed value, and compose will be called afterwards.
             * The composition is allowed to not accept orientation changes, and must then fire a ViewportOrientationChangeException.
             */
            Orientation: Panels.Viewport.Orientation;
            /**
             * Decides the order and size of panels in a viewport.
             * @param panels The panels from the group that have to be composed
             * @param initialOrdering Whether or not this is the first time the composition is being made for the current Group. (Defaults to false)
             * @return A collection of viewport state changes that have to be made to the viewport, in order to reach the desired composition for this type of ViewportComposition.
             */
            Compose(panels: Collections.Enumerable<ComposedPanelViewportState>, initialOrdering: boolean): Collections.Enumerable<ComposedPanelViewportStateChange>;
        }
        interface ICompositeViewportManager extends IViewportManager {
            /**
             * Arrange this viewport using the given Composer.
             * @param comp Composer to use.
             * @constructor
             */
            Compose(comp: IViewportComposition): void;
            /**
             * Get the last used composition.
             */
            CurrentComposition: IViewportComposition;
        }
        /**
         * Default ICompositeViewportManager implementation.
         *
         * Uses any jQuery animation to animate and tile the viewport panels next to each other in any orientation.
         */
        class CompositeViewportManager implements ICompositeViewportManager {
            ViewportOrientation: Orientation;
            AnimateInitialState: boolean;
            static ViewportClassHorizontal: string;
            static ViewportClassVertical: string;
            /**
             * Get the last used Composition.
             * @returns IViewportComposition
             * @constructor
             */
            CurrentComposition: IViewportComposition;
            /**
             * Animation duration of the selected easing function for composition animations.
             */
            AnimationDuration: number;
            /**
             * Any jQuery supported easing function.
             */
            AnimationEasing: string;
            /**
             * Th default animation direction, if it is not set by the composer.
             */
            AnimationDefaultDirection: Side;
            /**
             * PanelGroup main element: the viewport assigned to this manager.
             */
            private Element;
            /**
             * Panels that are known to the viewport manager.
             */
            private Panels;
            /**
             * Currently applied composition.
             */
            private Composition;
            /**
             * Ordered list of the current positions of every panel in view.
             */
            private Positions;
            /**
             * Whether or not this is the first arrangement/composition call.
             */
            private IsInitialComposition;
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            constructor(initialComposition?: IViewportComposition, ViewportOrientation?: Orientation, AnimateInitialState?: boolean);
            /**
             * Arrange this viewport using the given Composer.
             * @param comp Composer to use. (Optional; uses TilingViewportComposition as a default)
             */
            Compose(comp?: Panels.Viewport.IViewportComposition): void;
            /**
             * Set the viewport root element.
             * @param viewportElement The inner element of the PanelGroup.
             */
            SetElement(viewportElement: JQuery): void;
            /**
             * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
             * @param ref
             */
            Attach(ref: Panels.PanelReference): void;
            /**
             * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
             * @param ref
             */
            Detach(ref: Panels.PanelReference): void;
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             * @param ref
             */
            IsAttached(ref: Panels.PanelReference): boolean;
            /**
             * Arranges the panels in the Viewport in the given manner.
             * @param arrangement Accepts PanelViewportStateChange for interface compatibility but prefers ComposedPanelViewportStateChange objects, which also include a size modifier.
             */
            Arrange(arrangement: Collections.Enumerable<Panels.Viewport.PanelViewportStateChange>): void;
            /**
             * Arrange the given panels in the viewport for the initial panel setup.
             * @param arrangement The panels and their position and visibility in the viewport.
             */
            ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
        }
    }
}
declare module Panels {
    module Groups {
        /**
         * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
         */
        class TabbedPanelGroup extends StackingPanelGroup implements ILiftablePanelGroup {
            /**
             * The UL element containing all the tabs.
             */
            private TabsListElement;
            constructor();
            /**
             * Add an panel to the group.
             */
            AddPanel(panel: IPanel): void;
            AddTab(panel: IPanel, label: string): void;
            DetachPanel(name: string): IPanel;
            SetLabel(panelName: string, label: string): void;
            Show(name: string): void;
            private FindTabByName(name);
            ShowTabs(): void;
            HideTabs(): void;
            /**
             * Render all the sub panels.
             */
            Render(): void;
            FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void;
        }
    }
}
declare module Panels {
    module Groups {
        /**
         * @abstract
         */
        class ManagedPanelGroup<TViewportManager extends Panels.Viewport.IViewportManager, TExtendingPanelGroup extends ManagedPanelGroup<any, any>> extends Panels.PanelGroup implements Panels.IReferencedViewportPanelGroup, Events.IEventDispatcher {
            private _defaultVisibility;
            private _viewport;
            private _rendered;
            private References;
            Viewport: TViewportManager;
            constructor(viewport: TViewportManager, _defaultVisibility?: boolean, maximalVisibleCount?: number);
            Render(): void;
            /**
             * Add an panel to the group.
             */
            AddPanel(panel: IPanel): void;
            /**
             * Detach a panel from the group.
             */
            DetachPanel(name: string): IPanel;
            /**
             * Detach a panel from the group.
             */
            DetachPanelByReference(ref: Panels.PanelReference): IPanel;
            /**
             * Get a panel from the group by it's name.
             */
            GetPanel(name: string): IPanel;
            /**
             * Get a Panel of the specified type by the specified name.
             */
            GetTypedPanel<TPanel extends IPanel>(name: string): TPanel;
            /**
             * Get all panels of the given type.
             */
            GetPanelsByType<TPanel extends IPanel>(type: any): TPanel[];
            /**
             * Check if the group has a panel with the specified name.
             */
            HasPanel(name: string): boolean;
            /**
             * Check if this PanelGroup contains the given panel.
             */
            HasPanelByReference(ref: Panels.PanelReference): boolean;
            /**
             * Show a panel in view.
             */
            Show(name: string): void;
            /**
             * Show a panel by its reference object.
             */
            ShowByReference(ref: Panels.PanelReference): void;
            /**
             * Hide a Panel from view.
             */
            Hide(name: string): void;
            /**
             * Hide a panel by its reference object.
             */
            HideByReference(ref: Panels.PanelReference): void;
            /**
             * Check if a panel is shown in the current viewport.
             */
            IsVisible(name: string): boolean;
            /**
             * Check if a panel is visible by checking it's reference.
             */
            IsVisibleByReference(ref: Panels.PanelReference): boolean;
            /**
             * Place multiple panels in the viewport in the given order, hiding any other attached panels.
             */
            Place(names: string[]): void;
            /**
             * Place multiple panels in the viewport in the given order, hiding any other attached panels.
             */
            PlaceByReferences(refs: Panels.PanelReference[]): void;
            /**
             * Convert an Panel associated with this group to an reference.
             */
            private NameToReference(name);
            private MakeReference(panel);
            /**
             * Trigger an object event.
             */
            Dispatch(eventName: string, event: Events.IObjectEvent<Events.IEventDispatcher>): void;
            /**
             * Attach an event consumer object
             */
            Consume(consumer: Events.IEventConsumer, events?: string[]): void;
            /**
             * Remove an event consumer object
             */
            Starve(consumer: Events.IEventConsumer, events?: string[]): void;
            /**
             * Register a single callback for a single event
             */
            Attach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
            /**
             * Remove an attached event
             */
            Detach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
            /**
             * Shorthand for Attach, use exectly like the jQuery exuivalent
             */
            On(eventNames: string, callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void): void;
            /**
             * Stop the current event cycle from bubbling further down the attached events.
             */
            StopCurrentEventPropagation(): void;
        }
        class PanelGroupVisibilityEvent<TManagedPanelGroup extends ManagedPanelGroup<any, any>> implements Events.IObjectEvent<TManagedPanelGroup> {
            private _originatingObject;
            private _eventName;
            private _panelReference;
            constructor(_originatingObject: TManagedPanelGroup, _eventName: string, _panelReference: Panels.PanelReference);
            EventName: string;
            OriginatingObject: TManagedPanelGroup;
            PanelName: string;
            PanelReference: Panels.PanelReference;
            StopPropagation(): void;
        }
    }
}
declare module Panels {
    module Groups {
        class ResponsivePanelGroup<TViewportManager extends Panels.Viewport.IViewportManager> extends ManagedPanelGroup<TViewportManager, ResponsivePanelGroup<TViewportManager>> {
            /**
             * Create a ResponsivePanelGroup and auto create a viewportmanager for it of your choice with the given arguments.
             */
            static CreateWithViewport<TViewportType extends Panels.Viewport.IViewportManager>(viewportType: any, ...viewportArgs: any[]): ResponsivePanelGroup<TViewportType>;
        }
    }
}
declare module Panels {
    module Groups {
        /**
         * Panel group that supports compositing
         */
        class ComposablePanelGroup<TViewportManager extends Panels.Viewport.ICompositeViewportManager> extends ManagedPanelGroup<TViewportManager, ComposablePanelGroup<TViewportManager>> {
            Compose(composition: Panels.Viewport.IViewportComposition): void;
        }
    }
}
