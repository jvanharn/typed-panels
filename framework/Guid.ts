class Guid extends BaseObject {
    public constructor(private _guid: string){
        super();
    }
    
    public CompareTo(guid: Guid): number {
        if(guid.toString() == this._guid)
            return 0;
        if(guid.toString() > this._guid)
            return 1;
        if(guid.toString() < this._guid)
            return -1;
        throw new Error('Error during comparing, this JS engine really sucks.');
    }
    
    public toString(): string {
        return this._guid;
    }
    
    public static NewGuid(): Guid {
        // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return new Guid('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }));
    }
}