module Collections {
	export interface IEnumerable<T> {
		GetEnumerator(): IEnumerator<T>;
	}

	export interface IEnumerator<T> {
		Current: T;
		
		MoveNext(): boolean;
		Reset(): void;
		
		// Extra implementations not in C#
		IsValid(): boolean;
		HasNext(): boolean;
	}

	export class SimpleEnumerator<T> implements IEnumerator<T> {
		Index: number = 0;
		private Items: T[];
		get Current(): T {
			return this.Items[this.Index];
		}
		
		constructor(items: T[]) {
			if(items == undefined || items == null)
				throw new InvalidArgumentException();
			this.Items = items;
		}
		
		public MoveNext(): boolean {
			if(!this.HasNext())
				return false;
			this.Index++;
			return true;
		}
		
		public HasNext(): boolean {
			return (this.Index+1 < this.Items.length);//(this.Items[this.Index+1] !== undefined);
		}
		
		public IsValid(): boolean {
			return (this.Index < this.Items.length);
		}
		
		public Reset(): void {
			this.Index = 0;
		}
	}
}