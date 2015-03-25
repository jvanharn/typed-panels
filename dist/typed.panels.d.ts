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
        class ViewportException extends RuntimeException {
        }
        class InvalidViewportArrangementException extends ViewportException {
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
             *
             * Behaviour:
             *  - Detaching a panel is only possible if it is not currently visible in/placed inside the viewport. Otherwise the method should raise a ViewportException.
             * @param ref The reference to detach.
             */
            Detach(ref: Panels.PanelReference): void;
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             */
            IsAttached(ref: Panels.PanelReference): boolean;
            /**
             * Whether or not the given panel is attached to this manager and is visible in the viewport.
             * @param ref Reference to check.
             */
            IsVisible(ref: Panels.PanelReference): boolean;
            /**
             * Arrange the given panels in the viewport.
             *
             * The given arrangement *should* include _every panel that is in the viewport_ even if only
             *
             * Behaviour:
             *  - The ViewportManager *should* raise an InvalidViewportArrangementException when the arrangement does not include every panel from the previous/current viewport arrangement.
             * @param arrangement The panels and their position and visibility in the viewport.
             */
            Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>, doneCallback: any): void;
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
