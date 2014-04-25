/// <reference path="Collection.ts" />
/// <reference path="Enumerable.ts" />
/// <reference path="../../defs/lodash.d.ts" />
module Collections {
	export interface IDictionary<TKey, TValue> extends ICollection<KeyValuePair<TKey, TValue>> {
		Count: number;
		Keys: TKey[];
		Values: TValue[];
		Set(key: TKey, value: TValue): void;
		ContainsKey(key: TKey): boolean
		Remove(key: TKey): void;
		Remove(obj: any): void;
		Get(key: TKey): TValue;
		GetKey(value: TValue): TKey;
	}

	export interface IDictionaryEnumerator<TKey, TValue> extends IEnumerator<KeyValuePair<TKey, TValue>> {
		Index: number;
		Key: TKey;
		Value: TValue;
	}
	
	// Stores key/value pairs as objects, like in C#, good for storage in JS, very bad for search.
	export class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> implements IDictionary<TKey, TValue> {
		private Items: KeyValuePair<TKey, TValue>[] = [];
		
		get Count(): number {
			return this.Items.length;
		}
		
		get Keys(): TKey[] {
			//return _.pluck(this.Items, 'Key');
			var keys: TKey[] = [];
			var i=0;
			var l=this.Items.length;
			while(i < l)
				keys[keys.length] = this.Items[i].Key;
			return keys;
		}
		
		get Values(): TValue[] {
			//return _.pluck(this.Items, 'Value');
			var values: TValue[] = [];
			var i=0;
			var l=this.Items.length;
			while(i < l)
				values[values.length] = this.Items[i].Value;
			return values;
		}
		
		public Get(key :TKey): TValue {
			var i=0;
			var l=this.Items.length;
			while(i < l){
				if(this.Items[i].Key == key)
					return this.Items[i].Value;
			}
			return null;
		}
		
		public Set(key :TKey, value :TValue): void {
			var i=0;
			var l=this.Items.length;
			while(i < l){
				if(this.Items[i].Key == key)
					this.Items[i].Value = value;
			}
			this.Add(new KeyValuePair<TKey, TValue>(key, value));
		}
		
		public Add(item: KeyValuePair<TKey, TValue>): void {
		    this.Items[this.Items.length] = item;
		}
		
		public GetKey(value: TValue): TKey {
			var i=0;
			var l=this.Items.length;
			while(i < l){
				if(this.Items[i].Value == value)
					return this.Items[i].Key;
			}
			return null;
		}
		
		public Clear(): void {
			this.Items = [];
		}
		
		public Contains(item: KeyValuePair<TKey, TValue>): boolean {
			for(var i=0; i<this.Items.length; i++){
				if(item == this.Items[i])
					return true;
			}
			return false;
		}
		
		public ContainsKey(key: TKey): boolean {
			for(var i=0; i<this.Items.length; i++){
				if(key == this.Items[i].Key)
					return true;
			}
			return false;
		}
		
		public Remove(item: KeyValuePair<TKey, TValue>): void;
		public Remove(key: TKey): void;
		public Remove(obj: any): void {
		    if(obj instanceof KeyValuePair){ // KVP
		        for(var i=0; i<this.Items.length; i++){
		            if(this.Items[i] == obj)
		                this.Items.splice(i, 1);
		        }
		    } else { // Key
    			for(var i=0; i<this.Items.length; i++){
    				if(this.Items[i].Key == obj)
    					this.Items.splice(i, 1);
    			}
		    }
		}
		
		public CopyTo(collection: ICollection<KeyValuePair<TKey, TValue>>): void {
			for(var i=0; i<this.Items.length; i++){
				collection.Add(this.Items[i]);
			}
		}
		
		public GetNative(): any {
			return this.Items;
		}
		
		public GetEnumerator(): IEnumerator<KeyValuePair<TKey, TValue>> {
			return new DictionaryEnumerator<TKey, TValue>(this.Items);
		}
	}

	// More limited in what it can store than a storage dictionary but much faster due to it's use of native arrays and thu faster when using direct acces, but still has all the extended properties.
	export class SearchDictionary<TValue> extends Collection<KeyValuePair<string, TValue>> implements IDictionary<string, TValue> {
		_count = 0;
		Items: { [name: string]: TValue; } = {};
		
		get Count(): number {
			return this._count;
		}
		
		get Keys(): string[] {
			return (<any> this.Items).Keys();
		}
		
		get Values(): TValue[] {
			return _.values(this.Items);
		}

		public Get(key: string): TValue {
			return this.Items[key];
		}
		
		public Set(key: string, value: TValue): void {
			this.Items[key] = value;
		}
		
		public Add(item: KeyValuePair<string, TValue>): void {
			this.Items[item.Key] = item.Value;
		}
		
		public GetKey(value: TValue): string {
		    for(var prop in this.Items){
		        if(this.Items[prop] == value)
		            return prop;
		    }
		}
		
		public Clear(): void {
			this.Items = {};
		}
		
		public Contains(item: KeyValuePair<string, TValue>): boolean {
			for(var key in this.Items){
				if(key == item.Key && this.Items[key] == item.Value)
					return true;
			}
			return false;
		}
		
		public ContainsKey(key: string): boolean {
			return (key in this.Items);
		}
		
		public Remove(item: KeyValuePair<string, TValue>): void;
		public Remove(key: string): void;
		public Remove(obj: any): void {
		    if(obj instanceof KeyValuePair){ // KVP
		        for(var key in this.Items){
		            if(key == obj.Key && this.Items[key] == obj.Value)
		                delete this.Items[key];
		        }
		    } else { // Key
    			for(var key in this.Items){
    				if(this.Items[key] == obj)
    					delete this.Items[key];
    			}
		    }
		}
		
		public CopyTo(collection: ICollection<KeyValuePair<string, TValue>>): void {
			for(var key in this.Items)
				collection.Add(new KeyValuePair<string, TValue>(key, this.Items[key]));
		}
		
		public GetNative(): any {
			return this.Items;
		}
		
		public GetEnumerator(): IEnumerator<KeyValuePair<string, TValue>> {
			return new SearchDictionaryEnumerator<TValue>(this.Items);
		}
	}

	// Key value pair container, simplest of objects in TypeScript
	export class KeyValuePair<TKey, TValue> {
		constructor(public Key: TKey, public Value: TValue) { }
	}

	// Internal base enumerator class (Must be exported because the other class extends it, apparently)
	export class BaseDictionaryEnumerator<TKey, TValue> implements IDictionaryEnumerator<TKey, TValue> {
		_index = 0;
		public Key: TKey;
		public Value: TValue;
		
		get Index(): number {
			return this._index;
		}
		
		get Current(): KeyValuePair<TKey, TValue> { throw new AbstractMethodException(); }
		
		public HasNext(): boolean { throw new AbstractMethodException(); }
		
		public IsValid(): boolean { throw new AbstractMethodException(); }
		
		public MoveNext(): boolean {
			if(!this.HasNext())
				return false;
			this._index++;
			this.RefreshCurrent();
			return true;
		}
		
		public Reset(): void {
			this._index = 0;
			this.RefreshCurrent();
		}
		
		RefreshCurrent(): void { throw new AbstractMethodException(); }
	}
	
	// Dictionary Iterator
	export class DictionaryEnumerator<TKey, TValue> extends BaseDictionaryEnumerator<TKey, TValue> {
		get Current(): KeyValuePair<TKey, TValue> {
			return this.Items[this.Index];
		}
		
		public constructor(private Items: KeyValuePair<TKey, TValue>[]) { super(); }s
        
        public HasNext(): boolean {
			return (this.Index+1 < this.Items.length);
		}
		
		public IsValid(): boolean {
			return (this.Index < this.Items.length);
		}
        
		RefreshCurrent(): void {
			this.Key = this.Current.Key;
			this.Value = this.Current.Value;
		}
	}

	// Optimized iterator for searchdictionary
	export class SearchDictionaryEnumerator<TValue> extends BaseDictionaryEnumerator<string, TValue> {
		private Keys: string[] = (<any> this.Items).Keys();
		
		get Current(): KeyValuePair<string, TValue> {
			return new KeyValuePair<string, TValue>(this.Key, this.Value);
		}
		
		public constructor(private Items: { [name: string]: TValue; }) { super(); }
		
		public HasNext(): boolean {
			return !(this.Keys[this.Index+1] == undefined);
		}
		
		public IsValid(): boolean {
			return !(this.Keys[this.Index] == undefined);
		}
		
		RefreshCurrent(): void{
			this.Key = this.Keys[this.Index];
			this.Value = this.Items[this.Keys[this.Index]];
		}
	}
}