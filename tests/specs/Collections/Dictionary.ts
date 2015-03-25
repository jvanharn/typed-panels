describe('Collections.IDictionary', function(){
	_.each({
		'Collections.Dictionary': {
			obj: Collections.Dictionary,
			values: [
				new Collections.KeyValuePair('first', 'a'),
				new Collections.KeyValuePair('second', 'b'),
				new Collections.KeyValuePair('third', 'c'),
				new Collections.KeyValuePair('fourth', 'd')
			]
		},
		'Collections.Specialized.StringDictionary': {
			obj: Collections.Specialized.StringDictionary,
			values: [
				new Collections.KeyValuePair('first', 'a'),
				new Collections.KeyValuePair('second', 'b'),
				new Collections.KeyValuePair('third', 'c'),
				new Collections.KeyValuePair('fourth', 'd')
			]
		}
	}, function(dictData: any, dictName: string){
		describe('['+dictName+']', function(){
			var dictionary: Collections.IDictionary<string, string>;

			var fillDictionary = function(){
				for(var i=0; i<dictData.values.length; i++){
					(<any> dictionary).Add(dictData.values[i]);
				}
			};

			beforeEach(function(){
				dictionary = new dictData.obj();
			});

			// --> ElementAt
			it('ElementAt throws an IndexOutOfBoundsException on an index of less than 0', function(){

			});
		});
	});
});