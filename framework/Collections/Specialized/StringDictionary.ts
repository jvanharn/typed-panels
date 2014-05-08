/// <reference path="../Dictionary.ts" />

module Collections {
	export module Specialized {
		/**
		 * More limited in what it can store than a storage dictionary but much faster due to it's use of native arrays and thu faster when using direct acces, but still has all the extended properties.
 		 */
		export class StringDictionary<TValue> extends Collection<KeyValuePair<string, TValue>> implements IDictionary<string, TValue> {
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
				if(this.Items[key] === undefined){
					this.Items[key] = value;
					this._count++;
				}else{
					this.Items[key] = value;
				}
			}

			public Add(item: KeyValuePair<string, TValue>): void {
				if(item === undefined)
					throw new InvalidArgumentException();
				if(item == null){ // we are expected to accept null values
					//this.Items[''] = null;
					console.warn('It probably isn\'t smart to add Null values to a Dictionary. Maybe you\'d want to change your application to check for those kinds of values?');
				}else
					this.Items[item.Key] = item.Value;
				this._count++;
			}

			public GetKey(value: TValue): string {
				for(var prop in this.Items){
					if(this.Items[prop] == value)
						return prop;
				}
			}

			public Clear(): void {
				this.Items = {};
				this._count = 0;
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
				if(obj === undefined)
					throw new InvalidArgumentException();
				var removed = false;
				if(obj instanceof KeyValuePair){ // KVP
					for(var key in this.Items){
						if(key == obj.Key && this.Items[key] == obj.Value){
							delete this.Items[key];
							this._count--;
							removed = true;
						}
					}
				} else { // Key
					for(var key in this.Items){
						if(this.Items[key] == obj){
							delete this.Items[key];
							this._count--;
							removed = true;
						}
					}
				}
				if(!removed)
					throw new KeyNotFoundException();
			}

			public CopyTo(collection: ICollection<KeyValuePair<string, TValue>>): void {
				for(var key in this.Items)
					collection.Add(new KeyValuePair<string, TValue>(key, this.Items[key]));
			}

			public GetNative(): any {
				return this.Items;
			}

			public GetEnumerator(): IDictionaryEnumerator<string, TValue> {
				return new StringDictionaryEnumerator<TValue>(this.Items);
			}
		}

		/**
		 * Optimized iterator for searchdictionary
		 */
		export class StringDictionaryEnumerator<TValue> implements IDictionaryEnumerator<string, TValue> {
			private _index = 0;
			private Keys: string[];
			private Items: { [name: string]: TValue; }

			public Key: string;
			public Value: TValue;

			get Index(): number {
				return this._index;
			}

			get Current(): KeyValuePair<string, TValue> {
				if(this.Keys.length > 0)
					return new KeyValuePair<string, TValue>(this.Key, this.Value);
				return undefined;
			}

			public constructor(items: { [name: string]: TValue; }) {
				if(items == undefined || items == null)
					throw new InvalidArgumentException();
				this.Items = items;
				this.Keys = _.keys((<any> this.Items));
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
				return !(this.Keys[this.Index+1] == undefined);
			}

			public IsValid(): boolean {
				return !(this.Keys[this.Index] == undefined);
			}

			private RefreshCurrent(): void{
				if(this.Keys.length > 0) {
					this.Key = this.Keys[this.Index];
					this.Value = this.Items[this.Keys[this.Index]];
				}
			}
		}
	}
}