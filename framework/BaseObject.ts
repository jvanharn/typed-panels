/// <reference path="Hashable.ts" />

interface ConstructorPrototype extends ObjectPrototype {
    caller: string;
    length: number;
    arguments: any[];
    name: string; // altijd gevult
    
    prototype: ObjectPrototype;
    
    apply(object, args): void;
    bind(what: any): Function;
    call(...any): void;
}

interface ObjectPrototype {
    constructor: ConstructorPrototype;
    
    hasOwnProperty(): boolean;
    isPrototypeOf(): boolean;
    propertyIsEnumerable(): boolean;
    
    toLocaleString(): string;
    toString(): string;
    valueOf(): string;
}

/**
 * Simple object that all framework objects derive of.
 */
class BaseObject {
    /**
     * Simple cast method
     */
    public Cast<TCast>(): TCast { return (<TCast> <any> this); }
    
    /**
     * Get the typename of the current object
     */
    public GetType(): ObjectType {
        //return new ObjectType(<ConstructorPrototype> (<any> this).constructor.prototype);
        if(Object.getPrototypeOf)
            return new ObjectType(<ConstructorPrototype> Object.getPrototypeOf(this));
        
        try {
            return new ObjectType(<ConstructorPrototype> (<any> this).__proto__.constructor);
        }catch(e){
            console.warn('This browser does not support dynamic prototype retrieval.');
            return undefined;
        }
    }
}

class HashableObject extends BaseObject implements IHashable {
    private static _instanceCount: number = 0;
    private _objectHash: number;
    
    constructor() {
        super();
        this._objectHash = HashableObject._instanceCount ++;
    }
    
    /**
     * Get a unique hashcode for the given object in the form of a number.
     */
    public GetHashCode(): number {
        return this._objectHash;
    }
}

/**
 * Provides information about an object/class/prototype.
 */
class ObjectType {
    get Name(): string {
        return '';
    }
    
    get ModuleName(): string {
        return '';
    }
    
    get FullName(): string {
        return '';
    }
    
    get IsAbstract(): boolean {
        return false;
    }
    
    public constructor(private objPrototype: ConstructorPrototype) {
    }
    
    public GetOwnProperties(): string[] {
        return (<any>Object).getOwnPropertyNames(this.objPrototype);
    }
    
    public GetProperties(): string[] {
        return [];
    }
    
    public GetMethods(): string[] {
        return [];
    }
}
