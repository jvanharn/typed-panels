class Exception implements Error {
	public name: string = 'Exception';
	public message: string = 'No message given.';
	constructor(message?: string) {
		if(message !== undefined)
		    this.message = message;
	}

	public static IgnoreOrDefault<T>(obj: any, callback: Function, def: T, ...args: any[]): T {
		try {
			var args = [].concat(arguments).splice(2);
			return callback.apply(obj, args);
		}catch(e){
			return def;
		}
	}

	public static IgnoreAll(obj: any, callback: Function, ...args: any[]): void {
		try {
			var args = [].concat(arguments).splice(2);
			callback.apply(obj, args);
		}catch(e){ }
	}

	public static Ignore(callback: () => void){
		try {
			callback();
		}catch(e){}
	}

}
Exception.prototype = <any> Error;

class RuntimeException extends Exception {
	public name = 'RuntimeException';
	public message = 'No message given.';
	constructor(message?: string) {
		super(message);
	}
	public toString(): string {
	    return 'Exception "' + this.name + '" occurred with message; ' + this.message;
	}
}

class NotImplementedException extends RuntimeException {
	public name = 'NotImplementedException';
}
class AbstractMethodException extends NotImplementedException {
	public name = 'AbstractMethodException';
	public message = 'This method is an abstract stub. (As typescript does not support the abstract keyword). Please make sure this method is implemented if you get this exception.';
}
class MethodNotOverwrittenException extends RuntimeException {
	public name = 'MethodNotOverwrittenException';
	public message = 'This method\'s prototype should have been overwritten with the correct function, however, somehow it wasn\'t';
}
class MethodNotAccessibleException extends RuntimeException {
    public name = 'MethodNotAccessibleException';
}

class NullReferenceException extends RuntimeException {
    public name = 'NullReferenceException';
}

class KeyNotFoundException extends RuntimeException {
	public name = 'KeyNotFoundException';
	public message = 'The key you gave was not found in this collection.';
}
class IndexOutOfBoundsException extends RuntimeException {
	public name = 'IndexOutOfBoundsException';
	public message = 'The index given was less than 0 or larger than the length of this collection.';
}
class DuplicateKeyException extends RuntimeException {
	public name = 'DuplicateKeyException';
	public message = 'The key you wanted to add already exists on this collection.';
}

class InvalidArgumentException extends RuntimeException {
	public name = 'InvalidArgumentException';
	public message = 'The argument given to this method was invalid.';
}