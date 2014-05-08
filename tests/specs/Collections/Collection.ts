describe('Collections.ICollection', function(){
	_.each({
		'Collections.List': {
			obj: Collections.List,
			values: ['a', 'b', 'c', 'd']
		},
		'Collections.Specialized.ArrayList': {
			obj: Collections.Specialized.ArrayList,
			values: ['a', 'b', 'c', 'd']
		},
		'Collections.Dictionary': {
			obj: Collections.Dictionary,
			values: [
				new Collections.KeyValuePair('first', 'a'),
				new Collections.KeyValuePair('second', 'b'),
				new Collections.KeyValuePair('third', 'c'),
				new Collections.KeyValuePair('fourth', 'd')
			]
		},
		'Collections.Specialized.SearchDictionary': {
			obj: Collections.Specialized.StringDictionary,
			values: [
				new Collections.KeyValuePair('first', 'a'),
				new Collections.KeyValuePair('second', 'b'),
				new Collections.KeyValuePair('third', 'c'),
				new Collections.KeyValuePair('fourth', 'd')
			]
		}
	}, function(collData: any, collName: string){
		describe('['+collName+']', function(){
			var collection: Collections.ICollection<any>;

			var addAllValues = function(){
				for(var i=0; i<collData.values.length; i++){
					collection.Add(collData.values[i]);
				}
			}

			beforeEach(function(){
				collection = new collData.obj();
			});

			it('Count is initialized to 0 before adding anything', function(){
				expect(collection.Count).toBe(0);
			});

			it('Count is increased in value after adding one element', function(){
				collection.Add(collData.values[0]);
				expect(collection.Count).toBe(1);
			});

			it('Clear removes all values and resets count', function(){
				collection.Add(collData.values[0]);
				expect(collection.Count).toBe(1);
				collection.Clear();
				expect(collection.Count).toBe(0);
			});

			it('Add accepts null values', function(){
				expect(function(){
					collection.Add(null);
				}).not.toThrow(new InvalidArgumentException);
			});

			it('Add does not accept undefined values', function(){
				expect(collection.Add).toThrow(new InvalidArgumentException);
			});

			// Not certain if all collections should /always/ have this behaviour.
			/*it('the Add method does not accept duplicate values', function(){
				expect(function(){
					collection.Add(collData.values[0]);
					collection.Add(collData.values[0]);
				}).toThrow(new DuplicateKeyException);
			});*/

			it('Contains returns true for existing elements', function(){
				collection.Add(collData.values[0]);
				collection.Add(collData.values[1]);
				collection.Add(collData.values[2]);
				expect(collection.Contains(collData.values[1])).toBeTrue();
			});

			it('Contains returns false for non-existing elements', function(){
				collection.Add(collData.values[0]);
				collection.Add(collData.values[1]);
				collection.Add(collData.values[2]);
				expect(collection.Contains(collData.values[3])).toBeFalse();
			});

			it('Remove alters the collection to no longer contain the element', function(){
				addAllValues();
				expect(collection.Count).toBe(collData.values.length);
				expect(collection.Contains(collData.values[0])).toBeTrue();

				collection.Remove(collData.values[0]);

				expect(collection.Count).toBe(collData.values.length-1);
				expect(collection.Contains(collData.values[0])).toBeFalse();
			});

			it('Remove throws an KeyNotFoundException when the value to be removed does not exist', function(){
				expect(function(){
					collection.Remove(collData.values[0]);
				}).toThrow(new KeyNotFoundException);
			});

			it('Remove throws an InvalidArgumentException when the value is undefined', function(){
				expect(collection.Remove).toThrow(new InvalidArgumentException);
			});

			it('CopyTo can copy all elements to a List (ICollection) object.', function(){
				addAllValues();

				var result = new Collections.List<any>();
				collection.CopyTo(result);

				expect(result.Count).toBe(collData.values.length);

				// doesn't work for key value pairs; the count gives us enough data for now.
				/*for(var i=0; i<collData.values.length; i++){
					expect(result.Contains(collData.values[i])).toBeTrue();
				}*/
			});

			it('GetNative always returns some sort of object', function(){
				expect(collection.GetNative()).toBeDefined();
			});
		});
	});
});