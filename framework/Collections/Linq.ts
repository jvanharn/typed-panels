module Collections {
	export interface IEnumerable<T> {
	    /**
	     * Loop over the items in this enumerable.
	     */
	    Each(callback: (item: T) => void): void;
	    
	    /**
	     * Iterate over all items in this enumerable with the psoibility to stop iteration halfway. 
	     */
		BreakableEach(callback: (item: T, e: IEnumerator<T>) => boolean): void;
		
		/**
	     * Check whether any of the elements in this enumerable return true for the given predictate.
	     * Returns false for empty collections.
	     */
	    Any(predictate: (item: T) => boolean): boolean;
	    
	    /**
	     * Check whether all items in this enumerable return true for the given predictate.
	     * Returns true for empty collections.
	     */
	    All(predictate: (item: T) => boolean): boolean;
	    
	    /**
	     * Check if this enumeration contains an element inside another element.
	     */
		ContainsDeep<TItem>(item: TItem, extractor: (item: T) => TItem): boolean;
		
		/**
		 * Take all elements that adhere to the predictate.
		 */
		Where(predictate: (item: T) => boolean): Enumerable<T>;
		
		/**
		 * Convert the elements of this collection into another form/type.
		 */
		Select<TResult>(predictate: (item: T) => TResult): Enumerable<TResult>;
		
		/**
		 * Group the elements in this collection into different keys.
		 */
		GroupBy<TKey, TResult>(keySelector: (item: T) => TKey, resultSelector: (key: TKey, items: IEnumerable<T>) => TResult): Enumerable<TResult>;
		
		/**
		 * Remove duplicates in this collection.
		 * Warning: Very CPU heavy.
		 */
		Distinct(): IEnumerable<T>;
		
		/**
		 * Take all elements from the collection except for those in the given collection.
		 */
		Except(collection: ICollection<T>): IEnumerable<T>;
		
		/**
		 * Get the first element that adheres to the predictate or throw an exception if none exsists.
		 */
		First(predictate?: (item: T) => boolean): T;
		
		/**
		 * Get the first element that adheres to the predictate or a default value.
		 */
		FirstOrDefault(def: T, predictate?: (item: T) => boolean): T;
		
		Last(predictate?: (item: T) => boolean): T ;
		LastOrDefault(def: T, predictate?: (item: T) => boolean): T;
		ElementAt(index: number): T;
		ElementAtOrDefault(index: number): T;
		IndexOfFirst(predictate: (item: T) => boolean): number;
		Min(extractor?: (item: T) => number): T;
		Max(extractor?: (item: T) => number): T;
		CountAll(predictate?: (item: T) => boolean): number;
		
		/**
		 * Convert this enumerable to a List.
		 */
		ToList(): List<T>;
		
		/**
		 * Convert this enumerable to a native JS Array.
		 */
		ToArray(): T[];
		
		/**
		 * Convert this enumerable to a Dictionary.
		 */
		ToDictionary<TKey, TValue>(keyExtractor: (item: T) => TKey, valueExtractor: (item: T) => TValue, dict?: IDictionary<TKey, TValue>): IDictionary<TKey, TValue>;
	}
	
	/**
	 * Simple and fast Linq extensions
	 */
	export class Enumerable<T> implements IEnumerable<T> {
	    // Return false to cancel, return true to continue, return null to.. nothing.
	    public Each(callback: (item: T) => void): void {
	        var e = this.GetEnumerator();
			if(e.Current == undefined)
		        return;
			do {
				callback(e.Current);
			} while(e.MoveNext())
	    }
	    
	    public BreakableEach(callback: (item: T, e: IEnumerator<T>) => boolean): void {
	        var e = this.GetEnumerator();
			if(e.Current == undefined)
		        return;
			do {
				callback(e.Current, e);
			} while(e.MoveNext())
	    }
	    
	    /**
	     * Check whether any of the elements in this enumerable return true for the given predictate.
	     * Returns false for empty collections.
	     */
	    public Any(predictate: (item: T) => boolean): boolean {
	        var e = this.GetEnumerator();
			if(e.Current == undefined)
		        return false;
			do {
				if(predictate(e.Current))
				    return true;
			} while(e.MoveNext());
			return false;
	    }
	    
	    /**
	     * Check whether all items in this enumerable return true for the given predictate.
	     * Returns true for empty collections.
	     */
	    public All(predictate: (item: T) => boolean): boolean {
	        var e = this.GetEnumerator();
			if(e.Current == undefined)
		        return true;
			do {
				if(!predictate(e.Current))
				    return false;
			} while(e.MoveNext());
			return true;
	    }
	    
		public ContainsDeep<TItem>(item: TItem, extractor: (item: T) => TItem): boolean {
			var e = this.GetEnumerator();
			if(e.Current == undefined)
		        return false;
			do {
				if(extractor(e.Current) == item)
					return true;
			} while(e.MoveNext())
			return false;
		}
		
		public Where(predictate: (item: T) => boolean): Enumerable<T> {
			var e = this.GetEnumerator();
			var l = new List<T>();
			if(e.Current == undefined)
		        return l;
			do {
				if(predictate(e.Current))
					l.Add(e.Current);
			} while(e.MoveNext())
			return l;
		}
		
		public Select<TResult>(predictate: (item: T) => TResult): Enumerable<TResult> {
			var e = this.GetEnumerator();
			var l = new List<TResult>();
			if(e.Current == undefined)
		        return l;
			do {
				l.Add(predictate(e.Current));
			} while(e.MoveNext())
			return l;
		}
		
		public GroupBy<TKey, TResult>(keySelector: (item: T) => TKey, resultSelector: (key: TKey, items: IEnumerable<T>) => TResult): Enumerable<TResult> {
		    // Map to temporary dictionary
		    var e = this.GetEnumerator();
		    var d = new Dictionary<TKey, List<T>>();
			if(e.Current == undefined)
		        return new List<TResult>();
			do {
			    var k = keySelector(e.Current);
			    if(d.ContainsKey(k)){
			        var t = new List<T>();
			        d.Set(k, t);
			    }else d.Get(k).Add(e.Current);
			} while(e.MoveNext())
			// Map to resulting container
			var l = new List<TResult>();
			d.Each((item) => l.Add(resultSelector(item.Key, item.Value)));
			return l;
		}
		
		public Distinct(): IEnumerable<T> {
		    var e = this.GetEnumerator();
		    var d = new List<T>();
			if(e.Current == undefined)
		        return d;
		    do {
		        if(!d.Contains(e.Current))
		            d.Add(e.Current);
		    } while(e.MoveNext());
		    return d;
		}
		
		public Except(collection: ICollection<T>): IEnumerable<T>{
		    var e = this.GetEnumerator();
		    var r = new List<T>();
		    if(e.Current == undefined)
		        return r;
		    do {
		        if(!collection.Contains(e.Current))
		            r.Add(e.Current);
		    } while(e.MoveNext());
		    return r;
		}
		
		public First(predictate?: (item: T) => boolean): T {
		    var e = this.GetEnumerator();
		    if(predictate == undefined)
		        return e.Current;
		    else {
    			do {
    			    if(predictate(e.Current))
    				    return e.Current;
    			} while(e.MoveNext())
		    }
			return null;
		}
		
		public FirstOrDefault(def: T, predictate?: (item: T) => boolean): T {
		    var e = this.GetEnumerator();
		    if(predictate == undefined)
		        return e.Current;
		    else {
    			do {
    			    if(predictate(e.Current))
    				    return e.Current;
    			} while(e.MoveNext())
		    }
			return def;
		}
		
		public Last(predictate?: (item: T) => boolean): T {
		    var e = this.GetEnumerator();
		    if(predictate == undefined){
		        var lastSatisfied = null;
		        do {
    			    lastSatisfied = e.Current;
    			} while(e.MoveNext());
    			return lastSatisfied;
		    }else{
    		    var lastSatisfied = null;
    			do {
    			    if(predictate(e.Current))
    				    lastSatisfied = e.Current;
    			} while(e.MoveNext());
    			return lastSatisfied;
		    }
		}
		
		public LastOrDefault(def: T, predictate?: (item: T) => boolean): T {
		    var e = this.GetEnumerator();
		    if(predictate == undefined){
		        var lastSatisfied = def;
		        do {
    			    lastSatisfied = e.Current;
    			} while(e.MoveNext());
    			return lastSatisfied;
		    }else{
    		    var lastSatisfied = def;
    			do {
    			    if(predictate(e.Current))
    				    lastSatisfied = e.Current;
    			} while(e.MoveNext());
    			return lastSatisfied;
		    }
		}
		
		public ElementAt(index: number): T {
		    var e = this.GetEnumerator();
		    if(e.Current == undefined)
		        return null;
	        var i = 0;
		    do {
		        if(index == i)
		            return e.Current;
		        i++;
		    } while(e.MoveNext());
		    return null;
		}
		
		public ElementAtOrDefault(index: number): T {
		    var elem = this.ElementAt(index);
		    if(elem == null)
		        throw new Error('Index is invalid.');
		    return elem;
		}
		
		public IndexOfFirst(predictate: (item: T) => boolean): number {
		    var e = this.GetEnumerator();
		    if(e.Current == undefined)
		        return -1;
	        var index = 0;
		    do {
		        if(predictate(e.Current))
		            return index;
		        index++;
		    } while(e.MoveNext());
		    return -1;
		}
		
		public Min(extractor?: (item: T) => number): T {
		    var e = this.GetEnumerator();
		    if(extractor == undefined) {
		        if(typeof e.Current == 'number'){
		            var min = e.Current;
		            while(e.MoveNext()) {
		                if(min > e.Current)
		                    min = e.Current;
		            }
		        }else throw new Error('Invalid type given, expected number. Please extract the correct value.');
		    } else {
		        if(e.Current == undefined)
		            return null;
		        var minObj = e.Current;
		        var minNum: number = extractor(e.Current);
	            while(e.MoveNext()) {
	                var num = extractor(e.Current);
	                if(minNum > num){
	                    minNum = num;
	                    minObj = e.Current;
	                }
	            }
	            return minObj;
		    }
		}
		
		public Max(extractor?: (item: T) => number): T {
		    var e = this.GetEnumerator();
		    if(extractor == undefined) {
		        if(typeof e.Current == 'number'){
		            var max = e.Current;
		            while(e.MoveNext()) {
		                if(max < e.Current)
		                    max = e.Current;
		            }
		        }else throw new Error('Invalid type given, expected number. Please extract the correct value.');
		    } else {
		        if(e.Current == undefined)
		            return null;
		        var maxObj = e.Current;
		        var maxNum: number = extractor(e.Current);
	            while(e.MoveNext()) {
	                var num = extractor(e.Current);
	                if(maxNum < num){
	                    maxNum = num;
	                    maxObj = e.Current;
	                }
	            }
	            return maxObj;
		    }
		}
		
		public CountAll(predictate?: (item: T) => boolean): number {
		    var e = this.GetEnumerator();
		    if (predictate == undefined) {
		        if(this instanceof Collection){
		            return (<Collection<T>> this).Count;
		        }else{
		            var c = 0;
		            do {
        				c++;
        			} while(e.MoveNext());
        			return c;
		        }
		    } else {
		        var c = 0;
	            do {
	                if(predictate(e.Current))
    				    c++;
    			} while(e.MoveNext());
    			return c;
		    }
		}
		
		public ToList(): List<T> {
		    var e = this.GetEnumerator();
			var l = new List<T>();
			do {
				l.Add(e.Current);
			} while(e.MoveNext());
			return l;
		}
		
		public ToArray(): T[] {
		    var e = this.GetEnumerator();
			var l: T[] = [];
			while(e.MoveNext()) {
				l[l.length] = e.Current;
			}
			return l;
		}
		
		public ToDictionary<TKey, TValue>(keyExtractor: (item: T) => TKey, valueExtractor: (item: T) => TValue, dict?: IDictionary<TKey, TValue>): IDictionary<TKey, TValue> {
		    var e = this.GetEnumerator();
		    if(dict == undefined)
			    var dict: IDictionary<TKey, TValue> = new Dictionary<TKey, TValue>();
			while(e.MoveNext()) {
				dict.Set(keyExtractor(e.Current), valueExtractor(e.Current));
			}
			return dict;
		}
		
		public static CopyToArray<TValue>(e: IEnumerable<TValue>): TValue[] {
		    return this.EnumerateToArray(e.GetEnumerator());
		}
		
		public static EnumerateToArray<TValue>(e: IEnumerator<TValue>): TValue[] {
		    var r: TValue[] = [];
		    do {
                r.push(e.Current);
		    } while(e.MoveNext());
		    return r;
		}
		
		GetEnumerator(): IEnumerator<T> { throw new Error('This method is abstract, and should therefore be overridden by the extending class.'); }
	}
	
	export interface ICollection<T> extends IEnumerable<T> {
		RemoveAll(predictate: (item: T) => boolean): number;
		RemoveFirst(predictate: (item: T) => boolean): void;
	}
	
	// Does the same as an enumerable, but extends the functionality and makes
	export class Collection<T> extends Enumerable<T> implements ICollection<T> {
	    // Abstract Stubs
	    Count: number;
		Add(item: T): void { throw new NotImplementedException(); }
		Clear(): void { throw new NotImplementedException(); }
		Contains(item: T): boolean { throw new NotImplementedException(); }
		Remove(item: T): void { throw new NotImplementedException(); }
		CopyTo(collection: ICollection<T>): void { throw new NotImplementedException(); }
		GetNative(): any { throw new NotImplementedException(); }
		
		/**
		 * Remove all items in this collection that satisfy the given predictate.
		 */
		public RemoveAll(predictate: (item: T) => boolean): number {
		    var e = this.GetEnumerator();
		    var c = 0;
		    if(!e.IsValid())
		        return c;
		    do {
		        if(predictate(e.Current)){
		            this.Remove(e.Current);
		            c++;
		        }
		    } while(e.MoveNext());
		    return c;
		}
		
		/**
		 * Remove the first item that satisfies the given predictate.
		 */
		public RemoveFirst(predictate: (item: T) => boolean): void {
		    var e = this.GetEnumerator();
		    if(!e.IsValid())
		        return;
		    do {
		        if(predictate(e.Current)){
		            this.Remove(e.Current);
		            return;
		        }
		    } while(e.MoveNext());
		}
	}
}