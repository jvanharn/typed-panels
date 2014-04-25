/// <reference path="../Events/Events.ts" />
module Model {
    export interface ViewModelOptions {
        idProperty?: string; // What property serves as an ID property (Get's automatically send)
        readOnly?: boolean; // Whether or not this model can only be read or can also be written
        data?: {}; // Data object to send with the request
    }
    
    // Simple model event object
    class ModelEvent<TModel extends Events.IEventDispatcher> extends Events.ObjectEvent<TModel> {}
    
    // Lazy loading viewmodel
    export class ViewModel<TModel> extends Events.EventDispatcher {
        private _modelAttributes: string[] = [];
        private _modelValues: { [name: string]: any; } = null;
        private _modelDefaults: { [name: string]: any; } = null;
        private _modelUrl: string;
        private _options: ViewModelOptions;
        private _hasFetched: boolean = false;
        
        public constructor(url: string, options: ViewModelOptions = {}){
            super();
            this._modelUrl = url;
            if(options !== undefined && options !== null)
                this._options = options;
            else
                this._options = {};
        }
        
        // Iterates over all user added properties and changes them to dynamic getters and setters, so sync and save are no longer required.
        // This is pretty cool stuff :)
        public RefreshModelProperties(exclusionList: string[] = []){
			this._modelDefaults = {};
			this._modelValues = {};
			
			var blacklist: string[] = [
				'EventConsumers',
				'EventDelegates',
				'PropagationCanceled'
			].concat(exclusionList);
			
			var properties = Object.getOwnPropertyNames(this);
			_.each(properties, (value, key) => {
				if(value.substr(0, 1) != '_' && blacklist.indexOf(value) == -1){
					this._modelDefaults[value] = this[value];
					this._modelValues[value] = this[value];
					Object.defineProperty(this, value, {
						get: () => { return this.TryGet.bind(this)(value); },
						set: (newval) => { this.Set.bind(this)(value, newval); },
						enumerable: true,
						configurable: true
					});
				}
			});
			console.log(this._modelValues);
        }
        
        // Identifier property if any, or null (No exceptions)
        public GetID(): any {
            if(this._options.idProperty == undefined){
                if(_.contains(this._modelAttributes, 'id'))
                    return this._modelValues['id'];
                else return null;
            }else
                return this.SafeGet(this._options.idProperty);
        }
        
        // Will not try fetch the property if it isnt fetched yet
        public SafeGet(name: string): any {
            if(this._modelValues[name])
				return this._modelValues[name];
            else if(this._modelValues[this.UCFirst(name)] !== undefined)
				return this._modelValues[this.UCFirst(name)];
			return undefined;
        }
        
        // Get the property or returns undefined
        public Get(name: string): any;
        public Get<TValue>(name: string): TValue {
            if(this._modelValues == null)
                this.Fetch(false);
			if(this._modelValues[name])
				return this._modelValues[name];
            else if(this._modelValues[this.UCFirst(name)] !== undefined)
				return this._modelValues[this.UCFirst(name)];
            return undefined;
        }
        
        // Get the property or raise an exception
        public TryGet(name: string): any;
        public TryGet<TValue>(name: string): TValue {
            if(this._modelValues == null)
                this.Fetch(false);
			if(this._modelValues[name])
				return this._modelValues[name];
            else if(this._modelValues[this.UCFirst(name)] !== undefined)
				return this._modelValues[this.UCFirst(name)];
			else throw new Error('Attribute "'+this.UCFirst(name)+'" doesn\'t exist on ViewModel '+this.GetType().Name);
        }
        
        // Get multiple properties when they're available
        public AsyncGetAttributes(attributes: string[], success: (attributes: { [attribute:string]: any; }) => void): void {
            if(this._modelValues == null)
                this.Fetch(true, null, () => {
                    success(<any> _.pick(this._modelValues, attributes));
                });
            else
                success(<any> _.pick(this._modelValues, attributes));
        }
        
        // Set the value of an value.
        public Set(name: string, value: any, preventEvent: boolean = false): void {
            if(preventEvent != true)
                this.Dispatch('set', new ModelEvent(this, 'set', {
                    name: name,
                    oldValue: this._modelValues[name],
                    newValue: value
                }));
            this._modelValues[name] = value;
            if(preventEvent != true)
                this.Dispatch('change', new ModelEvent(this, 'change', this._modelValues));
        }
        
        // fetch all data from the server for this viewmodel. (Success callback only gets executed on async requests!)
        public Fetch(async: boolean = true, options?: ViewModelOptions, success?: (model: TModel) => void): void {
            if(async === false){
                console.log('Fetching model '+ this.GetType().Name +' synchronously from ' + this._modelUrl);
                $.ajax({
                    dataType: "json",
                    url: this._modelUrl,
                    async: false,
                    data: (options && options.data) ?
                        _.merge({ id: this.GetID() }, options.data):
                        { id: this.GetID() },
                    success: (jsonObj) => {
                        this._hasFetched = true;
                        
                        this._modelValues = jsonObj;
                        this.Dispatch('fetch', new ModelEvent(this, 'fetch', this._modelValues));
                        this.Dispatch('change', new ModelEvent(this, 'change', this._modelValues));
                    }
                });
            }else if(async === true){
                console.log('Fetching model '+ this.GetType().Name +' synchronously from ' + this._modelUrl);
                jQuery.getJSON(
                    this._modelUrl,
                    (options && options.data) ?
                        _.merge({ id: this.GetID() }, options.data):
                        { id: this.GetID() },
                    (jsonObj) => {
                        this._hasFetched = true;
                        
                        this._modelValues = jsonObj;
                        this.Dispatch('fetch', new ModelEvent(this, 'fetch', this._modelValues));
                        this.Dispatch('change', new ModelEvent(this, 'change', this._modelValues));
                        success(<TModel> <any> this);
                    }
                );
            }
        }
        
        public Save(): void { throw new Error('Not implemented'); }
        public Sync(): void { throw new Error('Not implemented'); }
		
		/**
		 * Gives you a plain object snapshot of the current values of the model without any event listeners etc, etc.
		 * Example of usage: For lodash or underscore templates or other places where u use a "with() {}" construct.
		 */
		public ToObject(): any {
		    // Try and fetch model:
		    
			return jQuery.extend({}, this._modelValues); // Shallow copy obj
		}
		
		private UCFirst(str: string): string{
			return str.charAt(0).toUpperCase() + str.slice(1);
		}
    }
}
