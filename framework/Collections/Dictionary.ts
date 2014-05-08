/// <reference path="Collection.ts" />
/// <reference path="Enumerable.ts" />
/// <reference path="Linq.ts" />
/// <reference path="../Exceptions.ts" />
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
			if(item === undefined)
				throw new InvalidArgumentException();
			if(item == null){ // we are expected to accept null values
				this.Items.push(new KeyValuePair<TKey, TValue>(null, null));
				console.warn('It probably isn\'t smart to add Null values to a Dictionary. Maybe you\'d want to change your application to check for those kinds of values?');
			}else
		    	this.Items.push(item);
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
			if(obj === undefined)
				throw new InvalidArgumentException();
			var removed = false;
		    if(obj instanceof KeyValuePair){ // KVP
		        for(var i=0; i<this.Items.length; i++){
		            if(this.Items[i] == obj){
		                this.Items.splice(i, 1);
						removed = true;
					}
		        }
		    } else { // Key
    			for(var i=0; i<this.Items.length; i++){
    				if(this.Items[i].Key == obj){
    					this.Items.splice(i, 1);
						removed = true;
					}
    			}
		    }
			if(!removed)
				throw new KeyNotFoundException();
		}
		
		public CopyTo(collection: ICollection<KeyValuePair<TKey, TValue>>): void {
			for(var i=0; i<this.Items.length; i++){
				collection.Add(this.Items[i]);
			}
		}
		
		public GetNative(): any {
			return this.Items;
		}
		
		public GetEnumerator(): IDictionaryEnumerator<TKey, TValue> {
			return new DictionaryEnumerator<TKey, TValue>(this.Items);
		}
	}

	// Key value pair container, simplest of objects in TypeScript
	export class KeyValuePair<TKey, TValue> {
		constructor(public Key: TKey, public Value: TValue) { }
	}

	// Dictionary Iterator
	export class DictionaryEnumerator<TKey, TValue> implements IDictionaryEnumerator<TKey, TValue> {
		private _index = 0;
		private Items: KeyValuePair<TKey, TValue>[];

		public Key: TKey;
		public Value: TValue;

		get Index(): number {
			return this._index;
		}

		get Current(): KeyValuePair<TKey, TValue> {
			return this.Items[this.Index];
		}
		
		public constructor(items: KeyValuePair<TKey, TValue>[]) {
			if(items == undefined || items == null)
				throw new InvalidArgumentException();
			this.Items = items;
			this.RefreshCurrent();
		}

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

        public HasNext(): boolean {
			return (this.Index+1 < this.Items.length);
		}
		
		public IsValid(): boolean {
			return (this.Index < this.Items.length);
		}
        
		private RefreshCurrent(): void {
			if(this.Items.length > 0){
				this.Key = this.Current.Key;
				this.Value = this.Current.Value;
			}
		}
	}
}
