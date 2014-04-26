module Collections {
	export class ArrayHelper {
		public static GetEnumerator<T>(arr: Array<T>): IEnumerator<T> {
			if(arr == undefined)
				throw new InvalidArgumentException();
			return new Collections.SimpleEnumerator(arr);
		}
	}
}