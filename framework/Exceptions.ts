class Exception implements Error {
	public name: string = 'Exception';
	public message: string = 'No message given.';
	constructor(message?: string) {
		if(message !== undefined)
		    this.message = message;
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
	    return 'Exception "' + this.name + '" ocurred with message; ' + this.message;
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
}
class IndexOutOfBoundsException extends RuntimeException {
	public name = 'IndexOutOfBoundsException';
}