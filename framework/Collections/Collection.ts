/// <reference path="Enumerable.ts" />
module Collections {
	export interface ICollection<T> extends IEnumerable<T> {
		Count: number;
		
		Add(item: T): void;
		Clear(): void;
		Contains(item: T): boolean;
		Remove(item: T): void;
		CopyTo(collection: ICollection<T>): void;
		
		GetNative(): any;
	}
}