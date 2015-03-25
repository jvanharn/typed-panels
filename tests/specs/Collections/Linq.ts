describe('Collections.Linq', function(){
	_.each({
		'Collections.List': {
			obj: Collections.List,
			values: ['x','a', 'b', 'c', 'd', 'e']
		},
		'Collections.Dictionary': {
			obj: Collections.Dictionary,
			values: [
				new Collections.KeyValuePair('first', 'x'),
				new Collections.KeyValuePair('second', 'a'),
				new Collections.KeyValuePair('third', 'b'),
				new Collections.KeyValuePair('fourth', 'c'),
				new Collections.KeyValuePair('fifth', 'd'),
				new Collections.KeyValuePair('sixth', 'e')
			]
		}
	}, function(collectionData: any, collectionName: string){
		describe('['+collectionName+']', function(){
			var collection: Collections.IEnumerable<any>;

			var fillCollection = function(){
				for(var i=0; i<collectionData.values.length; i++){
					(<any> collection).Add(collectionData.values[i]);
				}
			};

			beforeEach(function(){
				collection = new collectionData.obj();
			});


			// --> Each
			it('Each iterates over every element', function(){
				fillCollection();
				expect((function(){
					var r = '';
					collection.Each(function(e){
						if(e.Value)
							r += e.Value;
						else
							r += e;
					});
					return r;
				})()).toBe('xabcde');
			});

			it('Each throws an InvalidArgumentException when the first parameter is not a function', function(){
				expect(collection.Each).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.Each(null);
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.Each(<any> 12);
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.Each(<any> 'abc');
				}).toThrow(new InvalidArgumentException);
			});


			// --> BreakableEach
			it('BreakableEach iterates over every element', function(){
				fillCollection();
				expect((function(){
					var r = '';
					collection.BreakableEach(function(e){
						if(e.Value)
							r += e.Value;
						else
							r += e;
						return true;
					});
					return r;
				})()).toBe('xabcde');
			});

			it('BreakableEach iterates over every element when nothing is returned', function(){
				fillCollection();
				expect((function(){
					var r = '';
					collection.BreakableEach(function(e){
						if(e.Value)
							r += e.Value;
						else
							r += e;
						return <any> undefined;
					});
					return r;
				})()).toBe('xabcde');
			});

			it('BreakableEach stops iteration on a false return', function(){
				fillCollection();
				expect((function(){
					var r = '';
					collection.BreakableEach(function(e){
						if(e === 'c' || (e.Value && e.Value == 'c'))
							return false;
						if(e.Value)
							r += e.Value;
						else
							r += e;
						return true;
					});
					return r;
				})()).toBe('xab');
			});

			it('BreakableEach throws an InvalidArgumentException when the first parameter is not a function', function(){
				expect(collection.BreakableEach).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.BreakableEach(null);
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.BreakableEach(<any> 12);
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.BreakableEach(<any> 'abc');
				}).toThrow(new InvalidArgumentException);
			});


			// --> Any
			it('Any finds elements in the enumerable', function(){
				fillCollection();
				expect(collection.Any(e => e == 'c' || (e.Value && e.Value == 'c'))).toBeTrue();
				expect(collection.Any(e => e == 'h' || (e.Value && e.Value == 'h'))).toBeFalse();
			});

			it('Any throws an InvalidArgumentException when the first parameter is not a function', function(){
				expect(collection.Any).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.Any(null);
				}).toThrow(new InvalidArgumentException);
			});


			// --> All
			it('All finds elements in the enumerable', function(){
				fillCollection();
				expect(collection.All(e => (e.toLocaleLowerCase && e.toLocaleLowerCase() == e) || (e.Value && e.Value.toLocaleLowerCase() == e.Value))).toBeTrue();
				expect(collection.All(e => e == 'h' || (e.Value && e.Value == 'h'))).toBeFalse();
			});

			it('All throws an InvalidArgumentException when the first parameter is not a function', function(){
				expect(collection.All).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.All(null);
				}).toThrow(new InvalidArgumentException);
			});


			// --> ContainsDeep
			it('ContainsDeep extracts and finds the correct objects', function(){
				fillCollection();
				expect(collection.ContainsDeep('a', item => !!item.Value ? item.Value : item)).toBeTrue();
				expect(collection.ContainsDeep('i', item => !!item.Value ? item.Value : item)).toBeFalse();
			});

			it('ContainsDeep throws an InvalidArgumentException when the second parameter is not a function', function(){
				expect(collection.ContainsDeep).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.ContainsDeep(null, null);
				}).toThrow(new InvalidArgumentException);
			});

			// --> Where
			it('Where selects the correct elements from the enumerable', function(){
				fillCollection();
				expect(collection.Select(item => !!item.Value ? item.Value : item).Where(item => item != 'x')).toBeEnumerable(['a', 'b', 'c', 'd', 'e']);
			});

			it('Where selects nothing when undefined or null is returned', function(){
				fillCollection();
				expect(collection.Select(item => !!item.Value ? item.Value : item).Where(item => (<any> null))).toBeEnumerable([]);
			});

			it('Where throws an InvalidArgumentException when the first parameter is not a function', function(){
				expect(collection.Where).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.Where(null);
				}).toThrow(new InvalidArgumentException);
			});

			// --> Select
			it('Select includes all elements in the correct form as per the predictate', function(){
				fillCollection();
				expect(collection.Select(item => !!item.Value ? item.Value : item)).toBeEnumerable(['x', 'a', 'b', 'c', 'd', 'e']);
			});

			it('Select includes all any value in the list that is returned', function(){
				fillCollection();
				expect(collection.Select(item => null)).toBeEnumerable([null, null, null, null, null, null]);
			});

			it('Select throws an InvalidArgumentException when the first parameter is not a function', function(){
				expect(collection.Select).toThrow(new InvalidArgumentException);
				expect(function(){
					collection.Select(null);
				}).toThrow(new InvalidArgumentException);
			});


			// --> OrderBy
			//@todo

			// --> GroupBy


			// --> Distinct


			// --> Except


			// --> First


			// --> FirstOrDefault


			// --> Last


			// --> LastOrDefault


			// --> ElementAt


			// --> ElementAtOrDefault


			// --> IndexOfFirst


			// --> Min


			// --> Max


			// --> CountAll


			// --> ToList


			// --> ToArray


			// --> ToDictionary


			// --> CopyToArray


			// --> EnumerateToArray


		});
	});
});