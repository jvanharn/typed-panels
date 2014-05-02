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
    public Cast<TCast>(): TCast;
    /**
    * Get the typename of the current object
    */
    public GetType(): ObjectType;
}
declare class HashableObject extends BaseObject implements IHashable {
    private static _instanceCount;
    private _objectHash;
    constructor();
    /**
    * Get a unique hashcode for the given object in the form of a number.
    */
    public GetHashCode(): number;
}
/**
* Provides information about an object/class/prototype.
*/
declare class ObjectType {
    private objPrototype;
    public Name : string;
    public ModuleName : string;
    public FullName : string;
    public IsAbstract : boolean;
    constructor(objPrototype: ConstructorPrototype);
    public GetOwnProperties(): string[];
    public GetProperties(): string[];
    public GetMethods(): string[];
}
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
    public name: string;
    public message: string;
    constructor(message?: string);
    static IgnoreOrDefault<T>(obj: any, callback: Function, def: T, ...args: any[]): T;
    static IgnoreAll(obj: any, callback: Function, ...args: any[]): void;
    static Ignore(callback: () => void): void;
}
declare class RuntimeException extends Exception {
    public name: string;
    public message: string;
    constructor(message?: string);
    public toString(): string;
}
declare class NotImplementedException extends RuntimeException {
    public name: string;
}
declare class AbstractMethodException extends NotImplementedException {
    public name: string;
    public message: string;
}
declare class MethodNotOverwrittenException extends RuntimeException {
    public name: string;
    public message: string;
}
declare class MethodNotAccessibleException extends RuntimeException {
    public name: string;
}
declare class NullReferenceException extends RuntimeException {
    public name: string;
}
declare class KeyNotFoundException extends RuntimeException {
    public name: string;
    public message: string;
}
declare class IndexOutOfBoundsException extends RuntimeException {
    public name: string;
    public message: string;
}
declare class DuplicateKeyException extends RuntimeException {
    public name: string;
    public message: string;
}
declare class InvalidArgumentException extends RuntimeException {
    public name: string;
    public message: string;
}
declare class Guid extends BaseObject {
    private _guid;
    constructor(_guid: string);
    public CompareTo(guid: Guid): number;
    public toString(): string;
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
        public Index: number;
        private Items;
        public Current : T;
        constructor(items: T[]);
        public MoveNext(): boolean;
        public HasNext(): boolean;
        public IsValid(): boolean;
        public Reset(): void;
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
        public Each(callback: (item: T) => void): void;
        public BreakableEach(callback: (item: T, e: IEnumerator<T>) => boolean): void;
        /**
        * Check whether any of the elements in this enumerable return true for the given predictate.
        * Returns false for empty collections.
        */
        public Any(predictate: (item: T) => boolean): boolean;
        /**
        * Check whether all items in this enumerable return true for the given predictate.
        * Returns true for empty collections.
        */
        public All(predictate: (item: T) => boolean): boolean;
        public ContainsDeep<TItem>(item: TItem, extractor: (item: T) => TItem): boolean;
        public Where(predictate: (item: T) => boolean): Enumerable<T>;
        public Select<TResult>(predictate: (item: T) => TResult): Enumerable<TResult>;
        public GroupBy<TKey, TResult>(keySelector: (item: T) => TKey, resultSelector: (key: TKey, items: IEnumerable<T>) => TResult): Enumerable<TResult>;
        public Distinct(): IEnumerable<T>;
        public Except(collection: ICollection<T>): IEnumerable<T>;
        public First(predictate?: (item: T) => boolean): T;
        public FirstOrDefault(def: T, predictate?: (item: T) => boolean): T;
        public Last(predictate?: (item: T) => boolean): T;
        public LastOrDefault(def: T, predictate?: (item: T) => boolean): T;
        public ElementAt(index: number): T;
        public ElementAtOrDefault(index: number): T;
        public IndexOfFirst(predictate: (item: T) => boolean): number;
        public Min(extractor?: (item: T) => number): T;
        public Max(extractor?: (item: T) => number): T;
        public CountAll(predictate?: (item: T) => boolean): number;
        public ToList(): List<T>;
        public ToArray(): T[];
        public ToDictionary<TKey, TValue>(keyExtractor: (item: T) => TKey, valueExtractor: (item: T) => TValue, dict?: IDictionary<TKey, TValue>): IDictionary<TKey, TValue>;
        static CopyToArray<TValue>(e: IEnumerable<TValue>): TValue[];
        static EnumerateToArray<TValue>(e: IEnumerator<TValue>): TValue[];
        public GetEnumerator(): IEnumerator<T>;
    }
    interface ICollection<T> extends IEnumerable<T> {
        RemoveAll(predictate: (item: T) => boolean): number;
        RemoveFirst(predictate: (item: T) => boolean): void;
    }
    class Collection<T> extends Enumerable<T> implements ICollection<T> {
        public Count: number;
        public Add(item: T): void;
        public Clear(): void;
        public Contains(item: T): boolean;
        public Remove(item: T): void;
        public CopyTo(collection: ICollection<T>): void;
        public GetNative(): any;
        /**
        * Remove all items in this collection that satisfy the given predictate.
        */
        public RemoveAll(predictate: (item: T) => boolean): number;
        /**
        * Remove the first item that satisfies the given predictate.
        */
        public RemoveFirst(predictate: (item: T) => boolean): void;
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
        public Value1: T1;
        public Value2: T2;
        constructor(Value1: T1, Value2: T2);
    }
    class Tuple<T1, T2, T3> extends BaseObject {
        public Value1: T1;
        public Value2: T2;
        public Value3: T3;
        constructor(Value1: T1, Value2: T2, Value3: T3);
    }
    class Quadruple<T1, T2, T3, T4> extends BaseObject {
        public Value1: T1;
        public Value2: T2;
        public Value3: T3;
        public Value4: T4;
        constructor(Value1: T1, Value2: T2, Value3: T3, Value4: T4);
    }
    class Pentuple<T1, T2, T3, T4, T5> extends BaseObject {
        public Value1: T1;
        public Value2: T2;
        public Value3: T3;
        public Value4: T4;
        public Value5: T5;
        constructor(Value1: T1, Value2: T2, Value3: T3, Value4: T4, Value5: T5);
    }
}
declare module Collections {
    class ArrayHelper {
        static GetEnumerator<T>(arr: T[]): IEnumerator<T>;
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
        public Count : number;
        public Add(item: T): void;
        public AddRange(collection: IEnumerable<T>): void;
        public Remove(item: T): void;
        public Clear(): void;
        public Contains(item: T): boolean;
        public IndexOf(item: T): number;
        public ElementAt(index: number): T;
        public Insert(index: number, item: T): void;
        public InsertRange(index: number, collection: IEnumerable<T>): void;
        public RemoveAt(index: number): void;
        public RemoveRange(index: number, count: number): void;
        public CopyTo(collection: ICollection<T>): void;
        public GetEnumerator(): IEnumerator<T>;
        /**
        * This is a native (It is natively implemented as an object) so this just returns this object :)
        */
        public GetNative(): any;
        /**
        * This makes sure that there are no gaps between indices after altering the elements in a list.
        */
        private _fixIndex();
        private _removeGap(gapStart, gapEnd);
        private _makeGap(gapStart, gapLength);
    }
    class ListEnumerator<T> implements IEnumerator<T> {
        public Index: number;
        private List;
        public Current : T;
        constructor(list: List<T>);
        public MoveNext(): boolean;
        public HasNext(): boolean;
        public IsValid(): boolean;
        public Reset(): void;
    }
    /**
    * List implementation based on an real array.
    */
    class ArrayList<T> extends Collection<T> implements IList<T> {
        /**
        * @access protected
        */
        public Items: T[];
        public Count : number;
        public Add(item: T): void;
        public AddRange(collection: IEnumerable<T>): void;
        public Remove(item: T): void;
        public RemoveRange(index: number, count: number): void;
        public Clear(): void;
        public Contains(item: T): boolean;
        public IndexOf(item: T): number;
        public ElementAt(index: number): T;
        public Insert(index: number, item: T): void;
        public InsertRange(index: number, collection: IEnumerable<T>): void;
        public RemoveAt(index: number): void;
        public CopyTo(collection: ICollection<T>): void;
        public GetEnumerator(): IEnumerator<T>;
        public GetNative(): any;
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
        public Count : number;
        public Keys : TKey[];
        public Values : TValue[];
        public Get(key: TKey): TValue;
        public Set(key: TKey, value: TValue): void;
        public Add(item: KeyValuePair<TKey, TValue>): void;
        public GetKey(value: TValue): TKey;
        public Clear(): void;
        public Contains(item: KeyValuePair<TKey, TValue>): boolean;
        public ContainsKey(key: TKey): boolean;
        public Remove(item: KeyValuePair<TKey, TValue>): void;
        public Remove(key: TKey): void;
        public CopyTo(collection: ICollection<KeyValuePair<TKey, TValue>>): void;
        public GetNative(): any;
        public GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>>;
    }
    class SearchDictionary<TValue> extends Collection<KeyValuePair<string, TValue>> implements IDictionary<string, TValue> {
        public _count: number;
        public Items: {
            [name: string]: TValue;
        };
        public Count : number;
        public Keys : string[];
        public Values : TValue[];
        public Get(key: string): TValue;
        public Set(key: string, value: TValue): void;
        public Add(item: KeyValuePair<string, TValue>): void;
        public GetKey(value: TValue): string;
        public Clear(): void;
        public Contains(item: KeyValuePair<string, TValue>): boolean;
        public ContainsKey(key: string): boolean;
        public Remove(item: KeyValuePair<string, TValue>): void;
        public Remove(key: string): void;
        public CopyTo(collection: ICollection<KeyValuePair<string, TValue>>): void;
        public GetNative(): any;
        public GetEnumerator(): IEnumerator<KeyValuePair<string, TValue>>;
    }
    class KeyValuePair<TKey, TValue> {
        public Key: TKey;
        public Value: TValue;
        constructor(Key: TKey, Value: TValue);
    }
    class BaseDictionaryEnumerator<TKey, TValue> implements IDictionaryEnumerator<TKey, TValue> {
        public _index: number;
        public Key: TKey;
        public Value: TValue;
        public Index : number;
        public Current : KeyValuePair<TKey, TValue>;
        public HasNext(): boolean;
        public IsValid(): boolean;
        public MoveNext(): boolean;
        public Reset(): void;
        public RefreshCurrent(): void;
    }
    class DictionaryEnumerator<TKey, TValue> extends BaseDictionaryEnumerator<TKey, TValue> {
        private Items;
        public Current : KeyValuePair<TKey, TValue>;
        constructor(items: KeyValuePair<TKey, TValue>[]);
        public HasNext(): boolean;
        public IsValid(): boolean;
        public RefreshCurrent(): void;
    }
    class SearchDictionaryEnumerator<TValue> extends BaseDictionaryEnumerator<string, TValue> {
        private Keys;
        private Items;
        public Current : KeyValuePair<string, TValue>;
        constructor(items: {
            [name: string]: TValue;
        });
        public HasNext(): boolean;
        public IsValid(): boolean;
        public RefreshCurrent(): void;
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
        public EventName : string;
        public OriginatingObject : TEventDispatcher;
        public Data : any;
        public StopPropagation(): void;
    }
    /**
    * Basic Implementation of an IEventDispatcher
    * @abstract
    */
    class EventDispatcher extends BaseObject implements IEventDispatcher {
        static WildcardEvent: string;
        public EventConsumers: Collections.Dictionary<string, Collections.List<IEventConsumer>>;
        public EventDelegates: Collections.Dictionary<string, Collections.List<(event: IObjectEvent<IEventDispatcher>) => void>>;
        public PropagationCanceled: boolean;
        /**
        * Trigger an object event.
        */
        public Dispatch(eventName: string, event: IObjectEvent<IEventDispatcher>): void;
        /**
        * Add consumer
        */
        public Consume(consumer: IEventConsumer, events?: string[]): void;
        /**
        * Remove consumer
        */
        public Starve(consumer: IEventConsumer, events?: string[]): void;
        /**
        * Register a single callback for a single event
        */
        public Attach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
        /**
        * Remove an attached event
        */
        public Detach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
        /**
        * Shorthand for Attach, use exectly like the jQuery exuivalent
        * Eventnames is a space separated list of events to bind.
        */
        public On(eventNames: string, callback: (event: IObjectEvent<IEventDispatcher>) => void): void;
        /**
        * Stop the current event cycle from bubling further down the attached events.
        */
        public StopCurrentEventPropagation(): void;
    }
    /**
    * Copies the Event Dispatcher methods to the class, so we can work around the single inheritance limitation.
    * IMPOTANT!: Also call this.InitEventSystem() in the constructor.
    */
    function CopyEventDispatcherPrototype(eventDispatcherImpl: Function): void;
}
declare module Model {
    interface ViewModelOptions {
        idProperty?: string;
        readOnly?: boolean;
        data?: {};
    }
    class ViewModel<TModel> extends Events.EventDispatcher {
        private _modelAttributes;
        private _modelValues;
        private _modelDefaults;
        private _modelUrl;
        private _options;
        private _hasFetched;
        constructor(url: string, options?: ViewModelOptions);
        public RefreshModelProperties(exclusionList?: string[]): void;
        public GetID(): any;
        public SafeGet(name: string): any;
        public Get(name: string): any;
        public TryGet(name: string): any;
        public AsyncGetAttributes(attributes: string[], success: (attributes: {
            [attribute: string]: any;
        }) => void): void;
        public Set(name: string, value: any, preventEvent?: boolean): void;
        public Fetch(async?: boolean, options?: ViewModelOptions, success?: (model: TModel) => void): void;
        public Save(): void;
        public Sync(): void;
        /**
        * Gives you a plain object snapshot of the current values of the model without any event listeners etc, etc.
        * Example of usage: For lodash or underscore templates or other places where u use a "with() {}" construct.
        */
        public ToObject(): any;
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
        public PanelName : string;
        /**
        * Get the unique identifier of this panel. (Unmodifyable)
        */
        public PanelSeqId : number;
        /**
        * Get the panel's outermost element.
        *
        * Use this element to move the entire Panel through the DOM.
        */
        public PanelElement : JQuery;
        /**
        * Get the panle's innermost element.
        *
        * Use this element to add/alter/remove content inside the Panel.
        */
        public ContentElement : JQuery;
        /**
        * @abstract
        */
        constructor();
        /**
        * Render the panel so it will be displayed.
        */
        public Render(): void;
        /**
        * This is the method the panel implementation will overwrite.
        * Please do not directly call this method unless you know what you are doing.
        * @abstract
        * @access protected
        */
        public Renderer(): void;
        /**
        * Asynchronusly retrieve an template to work with.
        */
        public withTemplate(name: string, callback: (tpl: _.TemplateExecutor) => void): void;
        /**
        * Synchronously retrieve an compiled template.
        */
        public GetTemplate(name: string): _.TemplateExecutor;
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
        DetachPanelByReference(ref: PanelReference): IPanel;
        /**
        * Check if the panel with the given name is registered with this group.
        */
        HasPanelByReference(ref: PanelReference): boolean;
        /**
        * Show a panel by its reference object.
        */
        ShowByReference(ref: PanelReference): void;
        /**
        * Hide a panel by its reference.
        */
        HideByReference(ref: PanelReference): void;
        /**
        * Check if a panel in this group is currently in the viewport.
        */
        IsVisibleByReference(ref: PanelReference): boolean;
    }
    class PanelGroup extends Panel implements IPanelGroup {
        public Panels: {
            [name: string]: IPanel;
        };
        constructor();
        /**
        * Add an panel to the group.
        */
        public AddPanel(panel: IPanel): void;
        /**
        * Detach the panel with the given name.
        */
        public DetachPanel(name: string): IPanel;
        /**
        * Get a panel from the group by it's name.
        */
        public GetPanel(name: string): IPanel;
        /**
        * Get a Panel of the specified type by the specified name.
        */
        public GetTypedPanel<TPanel extends IPanel>(name: string): TPanel;
        /**
        * Get all panels of the given type.
        */
        public GetPanelsByType(type: any): IPanel[];
        /**
        * Check if the group has a panel with the specified name.
        */
        public HasPanel(name: string): boolean;
    }
    class PanelGroupHelper {
        /**
        * Check whether the given panel is not attached to another group.
        */
        static IsPanelAttachable(panel: IPanel): boolean;
    }
}
declare class UnknownPanelException extends KeyNotFoundException {
    public name: string;
    public message: string;
}
declare module Panels {
    /**
    * @abstract
    */
    class ConsumablePanel extends Panel implements Events.IEventDispatcher {
        public EventConsumers: Collections.Dictionary<string, Collections.List<Events.IEventConsumer>>;
        public EventDelegates: Collections.Dictionary<string, Collections.List<(event: Events.IObjectEvent<Events.IEventDispatcher>) => void>>;
        public PropagationCanceled: boolean;
        /**
        * Trigger an object event.
        */
        public Dispatch(eventName: string, event: Events.IObjectEvent<Events.IEventDispatcher>): void;
        /**
        * Attach an event consumer object
        */
        public Consume(consumer: Events.IEventConsumer, events?: string[]): void;
        /**
        * Remove an event consumer object
        */
        public Starve(consumer: Events.IEventConsumer, events?: string[]): void;
        /**
        * Register a single callback for a single event
        */
        public Attach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
        /**
        * Remove an attached event
        */
        public Detach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
        /**
        * Shorthand for Attach, use exectly like the jQuery exuivalent
        */
        public On(eventNames: string, callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void): void;
        /**
        * Stop the current event cycle from bubbling further down the attached events.
        */
        public StopCurrentEventPropagation(): void;
    }
}
declare module Panels {
    class DynamicPanel extends ConsumablePanel {
        private RendererCallback;
        constructor(RendererCallback: (contentElement: JQuery, panelElement: JQuery, context: DynamicPanel) => void);
        public Render(): void;
    }
}
declare module Panels {
    module Groups {
        /**
        * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
        */
        class StackingPanelGroup extends PanelGroup implements ILiftablePanelGroup {
            public Show(panelId: string): void;
            public Hide(panelId: string): void;
            public Render(): void;
            public FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void;
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
        public Renderer(): void;
        public FillFromElement(panelElement: JQuery, contentElement?: JQuery): void;
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
        private static _setPanelName<T extends IPanel>(obj, panelName);
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
        public IsRendered : boolean;
        constructor(_partialUrl: string, _updateUrl: string);
        /**
        * Determines what to render.
        */
        public Render(): void;
        /**
        * Call this method to force the panel to refetch the main razor template. Use this if the partial updating went wrong, etc.
        */
        public ForceRerender(): void;
        /**
        * This method is called after the rendering of every partial piece of the panel. It can be used to add click events etc.
        * @abstract
        */
        public ProcessPartialRender(partialId: number, partialElement: JQuery): void;
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
        public ConsumeEvent(event: Events.IObjectEvent<any>): void;
        /**
        * This is the event mapper. It makes it possible for you to map an non razor event to an Razor event.
        * If this method returns null it will discard/ignore the event.
        * @abstract
        */
        public EventMapper(event: Events.IObjectEvent<any>): RazorPartialUpdateEvent;
    }
    class RazorPartialUpdateEvent implements Events.IObjectEvent<any> {
        private _originatingObject;
        private _eventName;
        private _partialId;
        private _partialHtml;
        constructor(_originatingObject: any, _eventName: string, _partialId: number, _partialHtml?: JQuery);
        public EventName : string;
        public OriginatingObject : any;
        /**
        * The Id number of an existing partial to update, or another positive number to add the element at the end or beginning.
        */
        public PartialId : number;
        /**
        * Optionally provide the HTML to fill the partial with, instead of asking the server for the content
        */
        public PartialHtml : JQuery;
        public StopPropagation(): void;
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
        public State : TState;
        constructor(_renderOnStateChange: boolean);
    }
    /**
    * Statefull panel that can have a ViewModel as state object.
    */
    class ModelPanel<TModel extends Model.ViewModel<any>> extends ConsumablePanel implements IStatefullPanel<TModel> {
        private _renderOnStateChange;
        private _state;
        public State : TModel;
        constructor(_renderOnStateChange: boolean, viewModel: TModel);
        /**
        * Render the current state object using the given template.
        */
        public RenderModel(templateName: string, async?: boolean): void;
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
        public State : TState;
        /**
        * Check whether this class has already been rendered.
        */
        public IsRendered : boolean;
        /**
        * Get the innermost element of the panel.
        */
        public ContentElement : JQuery;
        constructor(model: TState);
        /**
        * Calls the deferred renderer only once.
        */
        public Render(): void;
        /**
        * This is the deferred renderer function.
        * Implement it to use this abstract class.
        * @abstract
        */
        public StateRenderer(): void;
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
        public PanelName : string;
        /**
        * Get an unique query string that will point you to the PANEL element
        */
        public QueryString : string;
        /**
        * Get the panel element wrapped in an jQuery object
        */
        public OuterElement : JQuery;
        /**
        * Get the innermost element (Will be same element as the outermost element for most elements, will be different for crollable panels etc.)
        */
        public InnerElement : JQuery;
        /**
        * Get whether or not the panel is currently shown in the viewport.
        */
        /**
        * Set the visibility of the element inside the viewport.
        */
        public Visibility : boolean;
        /**
        * Get the group this panel is in.
        */
        public Group : IViewportPanelGroup;
        /**
        * Get the panel this object references to.
        */
        public Panel : IPanel;
        /**
        * Replacement for the toString builtin.
        */
        public toString(): string;
        /**
        * Checks whether two references are refering to the same object.
        */
        public Equals(obj: PanelReference): boolean;
        /**
        * Get an unique hashcode for the referenced panel.
        */
        public GetHashCode(): number;
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
            Reference: PanelReference;
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
            * The difference between the current position and old position.
            */
            Moves: number;
            /**
            * Direction in which the panel moves. (or null when Moves=0)
            */
            MovementDirection: Direction;
            /**
            * (Optional) The direction in which the element has to be animated (Only filled if the ViewportManager provided an animationDirectionCallback)
            */
            AnimationDirection: Side;
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
        * Defines what direction a movement is going.
        */
        enum Direction {
            Forward = 0,
            Backward = 1,
            Sidewards = 2,
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
            Attach(ref: PanelReference): void;
            /**
            * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
            */
            Detach(ref: PanelReference): void;
            /**
            * Check whether this Viewportmanager manages/knows this panel.
            */
            IsAttached(ref: PanelReference): boolean;
            /**
            * Arrange the given panels in the viewport.
            */
            Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>): void;
            /**
            * Arrange the panels in the viewport for the first render of the panelgroup.
            */
            ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
            /**
            * If the ViewportManager wants to know/relies on the AnimationPanelViewportState.AnimationDirection property, this method should return an callback that can process each element for the animation direction.
            * @return function|null
            */
            GetAnimationDirectionProvider(): (stateChange: PanelViewportStateChange) => Direction;
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
            public EachRef(callback: (ref: PanelReference, visibility: boolean) => void): void;
            public AttachRef(ref: PanelReference): void;
            public DetachRef(ref: PanelReference): void;
            public HasRef(ref: PanelReference): boolean;
            public HasRefByName(name: string): boolean;
            public GetRefByName(name: string): PanelReference;
            public GetRefsByPanelType<TPanel extends IPanel>(type: any): TPanel[];
            public PositionOfRef(ref: PanelReference): number;
            /**
            * Move the given element one place back in the list.
            */
            public MoveBack(ref: PanelReference): void;
            /**
            * Move the given element one place forward in the list.
            */
            public MoveForward(ref: PanelReference): void;
            /**
            * Move the given ref to the given index.
            */
            public MoveTo(ref: PanelReference, index: number): void;
            /**
            * Get all panels that are visible in the viewport.
            */
            public GetVisible(): Collections.List<PanelReference>;
            /**
            * Check if a panel is visible or not.
            */
            public IsVisible(ref: PanelReference): boolean;
            public SetVisibility(ref: PanelReference, visibility: boolean): void;
            public SetVisibilityAll(visibility: boolean): void;
            public GetCurrentState(): Collections.Enumerable<Viewport.PanelViewportState>;
            /**
            * Iterate over all panels in the dictionary returning an array with the corrected order and how each reference was mutated.
            * @return <Panel, Direction of animation, Places Moved, oldVisibility>
            */
            public TrackChanges(callback: () => void, animationDirectionCallback: (stateChange: Viewport.PanelViewportStateChange) => void): Collections.Enumerable<Viewport.PanelViewportStateChange>;
        }
    }
}
declare module Panels {
    module Viewport {
        /**
        * Defines the orientation of an axisbound operation.
        */
        enum Orientation {
            Horizontal = 0,
            Vertical = 1,
        }
        /**
        * Viewport Manager that tiles the panels horizontally OR vertically.
        * Has animations.
        */
        class TilingViewportManager implements IViewportManager {
            public ViewportOrientation: Orientation;
            public AnimateInitialState: boolean;
            static ViewportClassHorizontal: string;
            static ViewportClassVertical: string;
            public Element: JQuery;
            public AnimationDuration: number;
            public AnimationEasing: string;
            /**
            * Viewport recieves PanelGroup element that represents the viewport.
            */
            constructor(ViewportOrientation?: Orientation, AnimateInitialState?: boolean);
            /**
            * Viewport recieves PanelGroup element that represents the viewport.
            */
            public SetElement(viewportElement: JQuery): void;
            /**
            * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
            */
            public Attach(ref: PanelReference): void;
            /**
            * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
            */
            public Detach(ref: PanelReference): void;
            /**
            * Check whether this Viewportmanager manages/knows this panel.
            */
            public IsAttached(ref: PanelReference): boolean;
            /**
            * Arrange the given panels in the viewport according to the given orientation.
            */
            public Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>): void;
            /**
            * Arrange the panels in the viewport for the first render of the panelgroup.
            */
            public ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
            /**
            * This viewport manager does not rely on this functionality.
            * @return null
            */
            public GetAnimationDirectionProvider(): (stateChange: PanelViewportStateChange) => Direction;
        }
    }
}
declare module Panels {
    module Viewport {
        interface IViewportComposition {
        }
        interface ICompositeViewportManager extends IViewportManager {
            Compose(comp: IViewportComposition): void;
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
            public AddPanel(panel: IPanel): void;
            public AddTab(panel: IPanel, label: string): void;
            public DetachPanel(name: string): IPanel;
            public SetLabel(panelName: string, label: string): void;
            public Show(name: string): void;
            private FindTabByName(name);
            public ShowTabs(): void;
            public HideTabs(): void;
            /**
            * Render all the sub panels.
            */
            public Render(): void;
            public FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void;
        }
    }
}
declare module Panels {
    module Groups {
        /**
        * @abstract
        */
        class ManagedPanelGroup<TViewportManager extends Viewport.IViewportManager, TExtendingPanelGroup extends ManagedPanelGroup<any, any>> extends PanelGroup implements IReferencedViewportPanelGroup, Events.IEventDispatcher {
            private _defaultVisibility;
            private _viewport;
            private _rendered;
            private References;
            public Viewport : TViewportManager;
            constructor(viewport: TViewportManager, _defaultVisibility?: boolean, maximalVisibleCount?: number);
            public Render(): void;
            /**
            * Add an panel to the group.
            */
            public AddPanel(panel: IPanel): void;
            /**
            * Detach a panel from the group.
            */
            public DetachPanel(name: string): IPanel;
            /**
            * Detach a panel from the group.
            */
            public DetachPanelByReference(ref: PanelReference): IPanel;
            /**
            * Get a panel from the group by it's name.
            */
            public GetPanel(name: string): IPanel;
            /**
            * Get a Panel of the specified type by the specified name.
            */
            public GetTypedPanel<TPanel extends IPanel>(name: string): TPanel;
            /**
            * Get all panels of the given type.
            */
            public GetPanelsByType<TPanel extends IPanel>(type: any): TPanel[];
            /**
            * Check if the group has a panel with the specified name.
            */
            public HasPanel(name: string): boolean;
            /**
            * Check if this PanelGroup contains the given panel.
            */
            public HasPanelByReference(ref: PanelReference): boolean;
            /**
            * Show a panel in view.
            */
            public Show(name: string): void;
            /**
            * Show a panel by its reference object.
            */
            public ShowByReference(ref: PanelReference): void;
            /**
            * Hide a Panel from view.
            */
            public Hide(name: string): void;
            /**
            * Hide a panel by its reference object.
            */
            public HideByReference(ref: PanelReference): void;
            /**
            * Check if a panel is shown in the current viewport.
            */
            public IsVisible(name: string): boolean;
            /**
            * Check if a panel is visible by checking it's reference.
            */
            public IsVisibleByReference(ref: PanelReference): boolean;
            /**
            * Place multiple panels in the viewport in the given order, hiding any other attached panels.
            */
            public Place(names: string[]): void;
            /**
            * Place multiple panels in the viewport in the given order, hiding any other attached panels.
            */
            public PlaceByReferences(refs: PanelReference[]): void;
            /**
            * Convert an Panel associated with this group to an reference.
            */
            private NameToReference(name);
            private MakeReference(panel);
            /**
            * Trigger an object event.
            */
            public Dispatch(eventName: string, event: Events.IObjectEvent<Events.IEventDispatcher>): void;
            /**
            * Attach an event consumer object
            */
            public Consume(consumer: Events.IEventConsumer, events?: string[]): void;
            /**
            * Remove an event consumer object
            */
            public Starve(consumer: Events.IEventConsumer, events?: string[]): void;
            /**
            * Register a single callback for a single event
            */
            public Attach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
            /**
            * Remove an attached event
            */
            public Detach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void;
            /**
            * Shorthand for Attach, use exectly like the jQuery exuivalent
            */
            public On(eventNames: string, callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void): void;
            /**
            * Stop the current event cycle from bubbling further down the attached events.
            */
            public StopCurrentEventPropagation(): void;
        }
        class PanelGroupVisibilityEvent<TManagedPanelGroup extends ManagedPanelGroup<any, any>> implements Events.IObjectEvent<TManagedPanelGroup> {
            private _originatingObject;
            private _eventName;
            private _panelReference;
            constructor(_originatingObject: TManagedPanelGroup, _eventName: string, _panelReference: PanelReference);
            public EventName : string;
            public OriginatingObject : TManagedPanelGroup;
            public PanelName : string;
            public PanelReference : PanelReference;
            public StopPropagation(): void;
        }
    }
}
declare module Panels {
    module Groups {
        class ResponsivePanelGroup<TViewportManager extends Viewport.IViewportManager> extends ManagedPanelGroup<TViewportManager, ResponsivePanelGroup<TViewportManager>> {
            /**
            * Create a ResponsivePanelGroup and auto create a viewportmanager for it of your choice with the given arguments.
            */
            static CreateWithViewport<TViewportType extends Viewport.IViewportManager>(viewportType: any, ...viewportArgs: any[]): ResponsivePanelGroup<TViewportType>;
        }
    }
}
declare module Panels {
    module Groups {
        /**
        * Panel group that supports compositing
        */
        class ComposablePanelGroup<TViewportManager extends Viewport.ICompositeViewportManager> extends ManagedPanelGroup<TViewportManager, ComposablePanelGroup<TViewportManager>> {
            public Compose(composition: Viewport.IViewportComposition): void;
        }
    }
}
