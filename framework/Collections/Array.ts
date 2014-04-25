// Makes it possibe to get an enumerator for an array by modifying its prototype
// This does make the framework incompatible with many other prototype modifying libs so, I have implemented an alternative.
// This is known to be incompatible with exotic Linq in Javascript libraries
/*interface Array<T> extends Collections.IEnumerable<T> {
   //GetEnumerator(o: T): Array<T>;
   GetEnumerator(): Collections.IEnumerator<T>;
}

Array.prototype.GetEnumerator = function() {
    return new Collections.SimpleEnumerator(this);
}*/

module Collections {
	export class ArrayHelper {
		public static GetEnumerator<T>(arr: Array<T>): IEnumerator<T> {
			return new Collections.SimpleEnumerator(arr);
		}
	}
}