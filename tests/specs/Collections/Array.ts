describe('Collections.ArrayHelper', function(){
	describe('GetEnumerator', function(){
		var strArray: Array<string>;
		var intArray: Array<number>;
		var objArray: Array<any>;

		beforeEach(function(){
			strArray = [
				'some',
				'weird',
				'values'
			];
			intArray = [
				1,
				8,
				2,
				3
			];
		});

		it('should retain types in the resulting enumerator', function(){
			var enumerator = Collections.ArrayHelper.GetEnumerator(strArray);

			expect(enumerator).not.toBeUndefined();
			expect(enumerator instanceof Collections.SimpleEnumerator).toBeTruthy();
		});

		it('should return undefined on anything other than an array', function(){
			expect(Collections.ArrayHelper.GetEnumerator).toThrow(new InvalidArgumentException);
		});
	});
});