/// <reference path="Collection.ts" />
/// <reference path="Enumerable.ts" />
/// <reference path="Linq.ts" />
/// <reference path="../Exceptions.ts" />

module Collections {
	export interface IList<T> extends ICollection<T> {
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
	export class List<T> extends Collection<T> implements IList<T> {
	    private _length: number = 0;
		get Count(): number {
		    return this._length;
		}
		
		public Add(item: T): void {
			if(item === undefined)
				throw new InvalidArgumentException();
			this[this._length] = item;
			this._length++;
		}
		
		public AddRange(collection: IEnumerable<T>){
			if(collection === undefined)
				throw new InvalidArgumentException();
		    var e = collection.GetEnumerator();
		    if(e.Current != undefined)
		    do {
		        this.Add(e.Current);
		    } while(e.MoveNext());
		}
		
		public Remove(item: T): void {
			if(item === undefined)
				throw new InvalidArgumentException();
		    var minus = 0;
			for(var i=0; i < this._length; i++){
				if(item == this[i]){
					delete this[i];
					minus++;
				}
			}
			if(minus > 0){
				this._fixIndex();
				//this._length -= minus;
			}else throw new KeyNotFoundException();
		}
		
		public Clear(): void {
		    for(var i=0; i < this._length; i++){
				delete this[i];
			}
			this._length = 0;
		}
		
		public Contains(item: T): boolean {
			for(var i=0; i<this._length; i++){
				if(item == this[i])
					return true;
			}
			return false;
		}
		
		public IndexOf(item: T): number {
			if(item === undefined)
				throw new InvalidArgumentException();
			for(var i=0; i<this._length; i++){
				if(item == this[i])
					return i;
			}
			return -1;
		}
		
		public ElementAt(index: number): T {
			if(index === undefined)
				throw new InvalidArgumentException();
			if(index < 0 || index >= this._length)
				throw new IndexOutOfBoundsException();
		    return this[index];
		}
		
		public Insert(index: number, item: T): void {
			if(index === undefined || item === undefined)
				throw new InvalidArgumentException();
			if(index < 0 || index > this._length)
				throw new IndexOutOfBoundsException();

			this._makeGap(index, 1);
			this[index] = item;
		}
		
		public InsertRange(index: number, collection: IEnumerable<T>): void {
			if(index === undefined || collection == undefined)
				throw new InvalidArgumentException();
			if(index < 0 || index > this._length)
				throw new IndexOutOfBoundsException();

		    var elements = Enumerable.CopyToArray(<any> collection);
		    this._makeGap(index, elements.length);
		    for(var i=0; i<elements.length; i++){
		        this[i] = elements[i];
		    }
		}
		
		public RemoveAt(index: number): void {
			if(index === undefined)
				throw new InvalidArgumentException();
			if(index < 0 || index >= this._length)
				throw new IndexOutOfBoundsException();

			delete this[index];
			this._fixIndex();
		}

		public RemoveRange(index: number, count: number): void {
			if(index === undefined || count === undefined)
				throw new InvalidArgumentException();
			if((index < 0 || index >= this._length) || (count < 0 || count > (this._length-index)))
				throw new IndexOutOfBoundsException();

			for(var i=0; i < count; i++)
				delete this[index+i];

			this._fixIndex();
		}

		public MoveElementTo(indexFrom: number, indexTo: number): void {
			if(indexFrom > this._length || indexFrom < 0)
				throw new Error('List; IndexFrom out of bounds.');
			if(indexTo > this._length || indexTo < 0)
				throw new Error('List; IndexTo out of bounds.');

			var elem = this.ElementAt(indexFrom);
			this.RemoveAt(indexFrom);
			this.Insert(indexTo, elem);
		}
		
		public CopyTo(collection: ICollection<T>): void {
		    for(var i=0; i<this._length; i++){
		        collection.Add(this[i]);
		    }
		}
		
		public GetEnumerator(): IEnumerator<T> {
			return new ListEnumerator<T>(this);
		}
		
		/**
		 * This is a native (It is natively implemented as an object) so this just returns this object :)
		 */
		public GetNative(): any {
			return this;
		}
		
		/**
		 * This makes sure that there are no gaps between indices after altering the elements in a list.
		 */
		protected _fixIndex(): void {
		    var removed = 0;
	        var removalStart: number = -1;
			var total = this._length;
	        for(var i=0; i<total; i++){
	            if(this[i] === undefined && this[i+1] === undefined){
	                if(removalStart < 0)
	                    removalStart = i;
					//else continue;
	            }else if(removalStart >= 0 && this[i] !== undefined){
	                var rem = this._removeGap(removalStart, (i-1));
					removed += rem;
					total -= rem;
					removalStart = -1;
	            }else if(removalStart == -1 && this[i] === undefined){
	                var rem = this._removeGap(i, i);
					total -= rem;
					removed += rem;
				}
	        }
			if(removalStart > -1)
				removed += this._length-removalStart;
	        this._length -= removed;
		}
		
		protected _removeGap(gapStart: number, gapEnd: number): number {
			// fill gap
			var gapSize = (gapEnd-gapStart)+1;
			var gapPos = 1;
			for(var i=gapStart; i<this._length; i++){
				this[i] = this[gapEnd+gapPos];
				gapPos++;
			}
			// remove excess
			for(var r=this._length-gapSize; r<this._length; r++){
				delete this[r];
			}

			return gapSize;
		}
		
		protected _makeGap(gapStart: number, gapLength: number): void{
		    // Copy values after gapStart to object an delete originals
		    var tmp = {};
		    for(var i=0; i<(this._length-gapStart); i++){
		        tmp[i] = this[gapStart+i];
		        delete this[gapStart+i];
		    }
		    // Copy values to places after gap
		    for(var i=0; i<(this._length-gapStart); i++){
		        this[gapStart+gapLength+i] = tmp[i];
		    }
		    this._length += gapLength;
		}
	}
	
	export class ListEnumerator<T> implements IEnumerator<T> {
		Index: number = 0;
		private List: List<T>;
		
		get Current(): T {
			return this.List[this.Index];
		}
		
		constructor(list: List<T>) {
			if(list == undefined || list == null)
				throw new InvalidArgumentException();
			this.List = list;
		}
		
		public MoveNext(): boolean {
			if(!this.HasNext())
				return false;
			this.Index++;
			return true;
		}
		
		public HasNext(): boolean {
			return (this.Index+1 < this.List.Count);//(this.Items[this.Index+1] !== undefined);
		}
		
		public IsValid(): boolean {
			return (this.Index < this.List.Count);
		}
		
		public Reset(): void {
			this.Index = 0;
		}
	}
}
