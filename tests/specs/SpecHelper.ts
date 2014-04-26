declare module jasmine {
	interface Matchers {
		toBeFalse(): boolean;
		toBeTrue(): boolean;
		toBeSameEnumValue(expected: any): boolean;
	}
}

beforeEach(function() {
	jasmine.addMatchers({
		/*toThrowException: function () {
			return {
				compare: function (actual, expected) {
					var result = {};

					try {

					}

					result.pass = ();

					return result;
				}
			};
		},*/

		toBeFalse: function(){
			return {
				compare: function(actual, expected){
					return {
						pass: (actual === false),
						message: 'expected result to be exactly equalling false.'
					}
				}
			}
		},
		toBeTrue: function(){
			return {
				compare: function(actual, expected){
					return {
						pass: (actual === true),
						message: 'expected result to be exactly equalling true.'
					}
				}
			}
		},

		toBeSameEnumValue: function(){
			return {
				compare: function(actual, expected){
					console.log('equal comp:', actual, expected);
					if(actual instanceof Collections.KeyValuePair){
						var act = <Collections.KeyValuePair<string, string>> actual;
						var exp = <Collections.KeyValuePair<string, string>> expected;
						return {
							pass: (act.Key == exp.Key && act.Value == exp.Value),
							message: 'expected the variable to be "'+expected+'" but got "'+actual+'"'
						}
					}
					return {
						pass: (actual == expected),
						message: 'expected the variable to be "'+expected+'" but got "'+actual+'"'
					}
				}
			}
		}
	});
});