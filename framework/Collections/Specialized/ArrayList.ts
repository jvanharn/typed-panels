/// <reference path="../Collection.ts" />
/// <reference path="../Enumerable.ts" />
/// <reference path="../List.ts" />
/// <reference path="../Linq.ts" />
/// <reference path="../../Exceptions.ts" />

module Collections {
	export module Specialized {
		/**
		 * List implementation based on a native JS Array.
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
				if(item === undefined)
					throw new InvalidArgumentException();
				this.Items.push(item);
			}

			public AddRange(collection: IEnumerable<T>){
				if(collection === undefined)
					throw new InvalidArgumentException();
				this.Items = this.Items.concat(Enumerable.CopyToArray(collection));
			}

			public Remove(item: T): void {
				if(item === undefined)
					throw new InvalidArgumentException();
				var removed = false;
				for(var i=0; i<this.Items.length; i++){
					if(item == this.Items[i]){
						this.Items.splice(i, 1);
						removed = true;
					}
				}
				if(!removed)
					throw new KeyNotFoundException();
			}

			public RemoveRange(index: number, count: number): void {
				if(index === undefined || count === undefined)
					throw new InvalidArgumentException();
				if((index < 0 || index >= this.Items.length) || (count < 0 || count > (this.Items.length-index)))
					throw new IndexOutOfBoundsException();
				this.Items.splice(index, count);
			}

			public Clear(): void {
				this.Items = [];
			}

			public Contains(item: T): boolean {
				return (this.Items.indexOf(item) >= 0);
			}

			public IndexOf(item: T): number {
				if(item === undefined)
					throw new InvalidArgumentException();

				return this.Items.indexOf(item);
			}

			public ElementAt(index: number): T {
				if(index === undefined)
					throw new InvalidArgumentException();
				if(index < 0 || index >= this.Items.length)
					throw new IndexOutOfBoundsException();

				return this.Items[index];
			}

			public Insert(index: number, item: T): void {
				if(index === undefined || item === undefined)
					throw new InvalidArgumentException();
				if(index < 0 || index > this.Items.length)
					throw new IndexOutOfBoundsException();

				this.Items.splice(index, 0, item);
			}

			public InsertRange(index: number, collection: IEnumerable<T>): void {
				if(index === undefined || collection == undefined)
					throw new InvalidArgumentException();
				if(index < 0 || index > this.Items.length)
					throw new IndexOutOfBoundsException();

				var sliceAfter = this.Items.slice(index);
				var sliceBefore = this.Items;
				this.Items = sliceBefore.concat(Enumerable.CopyToArray(collection)).concat(sliceAfter);
			}

			public RemoveAt(index: number): void {
				if(index === undefined)
					throw new InvalidArgumentException();
				if(index < 0 || index >= this.Items.length)
					throw new IndexOutOfBoundsException();

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
}