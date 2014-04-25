module Collections {
	export interface IList<T> extends ICollection<T> {
	    ElementAt(index: number): T;
	    AddRange(collection: IEnumerable<T>): void;
		IndexOf(item: T): number;
		Insert(index: number, item: T): void;
		InsertRange(index: number, collection: IEnumerable<T>): void;
		RemoveAt(index: number): void;
		RemoveRange(indexStart: number, indexEnd: number): void;
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
			this[this._length] = item;
			this._length++;
		}
		
		public AddRange(collection: IEnumerable<T>){
		    var e = collection.GetEnumerator();
		    if(e.Current != undefined)
		    do {
		        this.Add(e.Current);
		    } while(e.MoveNext());
		}
		
		public Remove(item: T): void {
		    var minus = 0;
			for(var i=0; i < this._length; i++){
				if(item == this[i]){
					delete this[i];
					minus++;
				}
			}
			this._fixIndex();
			this._length -= minus;
		}
		
		public RemoveRange(indexStart: number, indexEnd: number): void {
		    var minus = 0;
		    for(var i=indexStart; i < indexEnd; i++){
				delete this[i];
				minus++;
			}
			this._fixIndex();
			this._length -= minus;
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
			for(var i=0; i<this._length; i++){
				if(item == this[i])
					return i;
			}
			return i;
		}
		
		public ElementAt(index: number): T {
		    return this[index];
		}
		
		public Insert(index: number, item: T): void {
			if(index >= this._length)
				throw new Error('Out of range exception.');
			this._makeGap(index, 1);
			this[index] = item;
		}
		
		public InsertRange(index: number, collection: IEnumerable<T>): void {
		    var elements = Enumerable.CopyToArray(collection);
		    this._makeGap(index, elements.length);
		    for(var i=0; i<elements.length; i++){
		        this[i] = elements[i];
		    }
		}
		
		public RemoveAt(index: number): void {
			if(index >= this._length)
				throw new Error('Out of range exception.');
			delete this[index];
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
		private _fixIndex(): void {
		    var removed = 0;
	        var removalStart: number = -1;
	        for(var i=0; i<this._length; i++){
	            if(this[i] == undefined && this[i+1] == undefined){
	                if(removalStart >= 0)
	                    continue;
	                else
	                    removalStart = i;
	            }else if(removalStart >= 0 && this[i] != undefined){
	                this._removeGap(removalStart, (i-1));
	                removalStart = -1;
	                removed += (i-1) - removalStart;
	            }else if(this[i] == undefined){
	                this._removeGap(i, i+1);
	                removed += 1;
	            }
	        }
	        this._length -= removed;
		}
		
		private _removeGap(gapStart: number, gapEnd: number): void{
		    for(var i=0; i<(gapEnd-gapStart); i++){
		        this[gapStart+i] = this[gapEnd+i];
		    }
		}
		
		private _makeGap(gapStart: number, gapLength: number): void{
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
		
		get Current(): T {
			return this.List[this.Index];
		}
		
		constructor(private List: List<T>) { }
		
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
			return (this.Index <= this.List.Count);
		}
		
		public Reset(): void {
			this.Index = 0;
		}
	}

    /**
     * List implementation based on an real array.
     */
	export class ArrayList<T> extends Collection<T> implements IList<T> {
	    /**
	     * @access protected
	     */
		Items: T[] = [];
		
		get Count(): number {
		    return this.Items.length;
		}
		
		public Add(item: T): void {
			this.Items[this.Items.length] = item;
		}
		
		public AddRange(collection: IEnumerable<T>){
		    this.Items.concat(Enumerable.CopyToArray(collection));
		}
		
		public Remove(item: T): void {
			for(var i=0; i<this.Items.length; i++){
				if(item == this.Items[i])
					this.Items.splice(i, 1);
			}
		}
		
		public RemoveRange(indexStart: number, indexEnd: number): void {
		    this.Items.splice(indexStart, indexEnd-indexStart);
		}
		
		public Clear(): void {
			this.Items = [];
		}
		
		public Contains(item: T): boolean {
			for(var i=0; i<this.Items.length; i++){
				if(item == this.Items[i])
					return true;
			}
			return false;
		}
		
		public IndexOf(item: T): number {
			for(var i=0; i<this.Items.length; i++){
				if(item == this.Items[i])
					return i;
			}
			return i;
		}
		
		public ElementAt(index: number): T {
		    return this.Items[index];
		}
		
		public Insert(index: number, item: T): void {
			if(index >= this.Items.length)
				throw new Error('Out of range exception.');
			this.Items.splice(index, 0, item);
		}
		
		public InsertRange(index: number, collection: IEnumerable<T>): void {
		    var sliceAfter = this.Items.slice(index);
		    var sliceBefore = this.Items;
		    this.Items = sliceBefore.concat(Enumerable.CopyToArray(collection)).concat(sliceAfter);
		}
		
		public RemoveAt(index: number): void {
			if(index >= this.Items.length)
				throw new Error('Out of range exception.');
			this.Items.splice(index, 1);
		}
		
		public CopyTo(collection: ICollection<T>): void {
		    for(var i=0; i<this.Items.length; i++){
		        collection.Add(this.Items[i]);
		    }
		}
		
		public GetEnumerator(): IEnumerator<T> {
			return new SimpleEnumerator<T>(this.Items);
		}
		
		public GetNative(): any {
			return this.Items;
		}
	}
}