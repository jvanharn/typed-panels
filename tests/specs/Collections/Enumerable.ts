describe('Collections.IEnumerator', function(){
	_.each({
		'Collections.SimpleEnumerator': {
			obj: Collections.SimpleEnumerator,

			firstExp: 'a',
			secondExp: 'b',

			filledArray: ['a','b'],
			emptyArray: []
		},
		'Collections.ListEnumerator': {
			obj: Collections.ListEnumerator,

			firstExp: 'a',
			secondExp: 'b',

			filledArray: (function(){
				var l = new Collections.List<string>();
				l.Add('a');
				l.Add('b');
				return l;
			})(),
			emptyArray: new Collections.List<string>()
		},
		'Collections.DictionaryEnumerator': {
			obj: Collections.DictionaryEnumerator,

			firstExp: new Collections.KeyValuePair('first', 'a'),
			secondExp: new Collections.KeyValuePair('second', 'b'),

			filledArray: [
				new Collections.KeyValuePair('first', 'a'),
				new Collections.KeyValuePair('second', 'b')
			],
			emptyArray: []
		},
		'Collections.Specialized.StringDictionaryEnumerator': {
			obj: Collections.Specialized.StringDictionaryEnumerator,

			firstExp: new Collections.KeyValuePair('first', 'a'),
			secondExp: new Collections.KeyValuePair('second', 'b'),

			filledArray: {
				'first': 'a',
				'second': 'b'
			},
			emptyArray: []
		}
	}, function(enumData: any, enumName: string){

		it('[' + enumName + '] throws an appropriate exception when constructor argument is not an array', function(){
			expect(function(){
				new enumData.obj(null)
			}).toThrow(new InvalidArgumentException);
		});

		describe('[' + enumName + '] with filled array:', function(){
			var enumerator: Collections.IEnumerator<string>;

			beforeEach(function(){
				enumerator = new enumData.obj(enumData.filledArray);
			});

			it('Current is filled before first call to moveNext', function(){
				expect(enumerator.Current).toBeSameEnumValue(enumData.firstExp);
			});

			it('Current is set to the second value after moveNext', function(){
				expect(enumerator.MoveNext()).toBeTrue();
				expect(enumerator.Current).toBeSameEnumValue(enumData.secondExp);
			});

			it('MoveNext returns false on the second call', function(){
				expect(enumerator.MoveNext()).toBeTrue();
				expect(enumerator.MoveNext()).toBeFalse();
			});

			it('HasNext returns true when it has more elements', function(){
				expect(enumerator.HasNext()).toBeTrue();
			});

			it('HasNext returns false when there are no more elements', function(){
				expect(enumerator.MoveNext()).toBeTrue();
				expect(enumerator.HasNext()).toBeFalse();
			});

			it('IsValid returns true', function(){
				expect(enumerator.MoveNext()).toBeTrue();
				expect(enumerator.MoveNext()).toBeFalse();
				expect(enumerator.IsValid()).toBeTrue();
			});
		});

		describe('[' + enumName + '] with empty array:', function(){
			var enumerator: Collections.IEnumerator<string>;

			beforeEach(function(){
				enumerator = new enumData.obj(enumData.emptyArray);
			});

			it('Current returns undefined', function(){
				expect(enumerator.Current).toBeUndefined();
			});

			it('MoveNext returns false', function(){
				expect(enumerator.MoveNext()).toBeFalse();
			});

			it('HasNext returns false', function(){
				expect(enumerator.HasNext()).toBeFalse();
			});

			it('IsValid returns false', function(){
				expect(enumerator.IsValid()).toBeFalse();
			});
		});
	});
});