describe('Collections.IList', function(){
	_.each({
		'Collections.List': {
			obj: Collections.List,
			values: ['a', 'b', 'c', 'd']
		},
		'Collections.Specialized.ArrayList': {
			obj: Collections.Specialized.ArrayList,
			values: ['a', 'b', 'c', 'd']
		}
	}, function(listData: any, listName: string){
		describe('['+listName+']', function(){
			var list: Collections.IList<any>;

			var fillList = function(){
				for(var i=0; i<listData.values.length; i++){
					list.Add(listData.values[i]);
				}
			};

			beforeEach(function(){
				list = new listData.obj();
			});

			// --> ElementAt
			it('ElementAt throws an IndexOutOfBoundsException on an index of less than 0', function(){
				expect(function(){
					list.ElementAt(-1);
				}).toThrow(new IndexOutOfBoundsException);
				expect(function(){
					list.ElementAt(-5);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('ElementAt throws an IndexOutOfBoundsException on an index equal to or larger than the length of the list (zero index check)', function(){
				expect(function(){
					list.ElementAt(0);
				}).toThrow(new IndexOutOfBoundsException);
				expect(function(){
					list.ElementAt(1);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('ElementAt throws an InvalidArgumentException when the index is undefined', function(){
				expect(list.ElementAt).toThrow(new InvalidArgumentException);
			});

			// --> AddRange
			it('AddRange silently adds an empty range (List)', function(){
				expect(function(){
					list.AddRange(new Collections.List<any>());
				}).not.toThrow();
			});

			it('AddRange successfully adds a complete range', function(){
				expect(list.Count).toBe(0);

				var range = new Collections.List<any>();
				for(var i=0; i<listData.values.length; i++){
					range.Add(listData.values[i]);
				}

				list.AddRange(range);

				expect(list.Count).toBe(listData.values.length);
				for(var i=0; i<listData.values.length; i++){
					expect(list.Contains(listData.values[i])).toBeTrue();
				}
			});

			it('AddRange throws an InvalidArgumentException when the collection/range is undefined', function(){
				expect(list.AddRange).toThrow(new InvalidArgumentException);
			});

			// --> IndexOf
			it('IndexOf returns -1 on an item that is not in the List', function(){
				expect(list.IndexOf(listData.values[0])).toBe(-1);
			});

			it('IndexOf returns the valid index on an item that is in the List', function(){
				fillList();
				expect(list.IndexOf(listData.values[1])).toBe(1);
			});

			it('IndexOf throws an InvalidArgumentException when the item is undefined', function(){
				expect(list.IndexOf).toThrow(new InvalidArgumentException);
			});

			// --> Insert
			it('Insert throws an IndexOutOfBoundsException when the index is less than 0 or more than the length of the list', function(){
				expect(function(){
					list.Insert(-1, listData.values[0]);
				}).toThrow(new IndexOutOfBoundsException);
				expect(function(){
					list.Insert(2, listData.values[0]);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('Insert does not throw an IndexOutOfBoundsException when the index is one more than the length of the list', function(){
				list.Add(listData.values[0]);
				expect(function(){
					list.Insert(1, listData.values[1]);
				}).not.toThrow(new IndexOutOfBoundsException);
			});

			it('Insert does not throw an exception when the index is the index of an already existing element and moves that element to index+1', function(){
				list.Add(listData.values[0]);
				expect(function(){
					list.Insert(0, listData.values[1]);
				}).not.toThrow();
				expect(list.ElementAt(0)).toBe(listData.values[1]);
				expect(list.ElementAt(1)).toBe(listData.values[0]);
			});

			it('Insert throws an InvalidArgumentException when the index or item is undefined', function(){
				expect(list.Insert).toThrow(new InvalidArgumentException);
				expect(function(){
					list.Insert(undefined, listData.values[0]);
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					list.Insert(0, undefined);
				}).toThrow(new InvalidArgumentException);
			});

			// --> InsertRange
			it('InsertRange throws an InvalidArgumentException when the index is undefined or the collection is undefined or null', function(){
				expect(list.InsertRange).toThrow(new InvalidArgumentException);
				expect(function(){
					list.InsertRange(undefined, new Collections.List<any>());
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					list.InsertRange(listData.values[0], undefined);
				}).toThrow(new InvalidArgumentException);
				expect(function(){
					list.InsertRange(listData.values[0], null);
				}).toThrow(new InvalidArgumentException);
			});

			// --> RemoveAt
			it('RemoveAt removes the specified element, and that element only', function(){
				fillList();
				expect(list.Count).toBe(listData.values.length);

				list.RemoveAt(1);

				expect(list.Count).toBe(listData.values.length-1);
				for(var i=0; i<listData.values.length; i++){
					if(i == 1)
						expect(list.Contains(listData.values[i])).toBeFalse();
					else
						expect(list.Contains(listData.values[i])).toBeTrue();
				}
			});

			it('RemoveAt throws an IndexOutOfBoundsException on an index of less than 0', function(){
				expect(function(){
					list.RemoveAt(-1);
				}).toThrow(new IndexOutOfBoundsException);
				expect(function(){
					list.RemoveAt(-5);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('RemoveAt throws an IndexOutOfBoundsException on an index equal to or larger than the length of the list (zero index check)', function(){
				expect(function(){
					list.RemoveAt(0);
				}).toThrow(new IndexOutOfBoundsException);
				expect(function(){
					list.RemoveAt(1);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('RemoveAt throws an InvalidArgumentException when the item is undefined', function(){
				expect(list.RemoveAt).toThrow(new InvalidArgumentException);
			});

			// --> RemoveRange
			it('RemoveRange removes a range in the center of the list', function(){
				fillList();
				expect(list.Count).toBe(listData.values.length);
				list.RemoveRange(1, listData.values.length-2);
				expect(list.Count).toBe(2);
			});

			it('RemoveRange removes a range on the beginning of the list', function(){
				fillList();
				expect(list.Count).toBe(listData.values.length);
				list.RemoveRange(0, listData.values.length-1);
				expect(list.Count).toBe(1);
			});

			it('RemoveRange removes a range on the end of the list', function(){
				fillList();
				expect(list.Count).toBe(listData.values.length);
				list.RemoveRange(1, listData.values.length-1);
				expect(list.Count).toBe(1);
			});

			it('RemoveRange throws an IndexOutOfBoundsException on an index of less than 0', function(){
				fillList();
				expect(function(){
					list.RemoveRange(-1, 0);
				}).toThrow(new IndexOutOfBoundsException);
				expect(function(){
					list.RemoveRange(-5, 0);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('RemoveRange throws an IndexOutOfBoundsException on an index equal to or larger than the length of the list (zero index check)', function(){
				fillList();
				expect(function(){
					list.RemoveRange(listData.values.length, 0);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('RemoveRange throws an IndexOutOfBoundsException when count makes the range larger than the list', function(){
				fillList();
				expect(function(){
					list.RemoveRange(0, listData.values.length+1);
				}).toThrow(new IndexOutOfBoundsException);
			});

			it('RemoveRange throws an InvalidArgumentException when the item is undefined', function(){
				expect(list.RemoveRange).toThrow(new InvalidArgumentException);
			});
		});
	});
});