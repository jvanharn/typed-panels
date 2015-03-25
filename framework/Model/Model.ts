/// <reference path="../../defs/_include.ts" />
/// <reference path="../Events/Events.ts" />
module Model {
    export interface ViewModelOptions {
        identityProperty?: string; // What property serves as an ID property (Get's automatically send) Defaulto to 'id'
        readOnly?: boolean; // Whether or not this model can only be read or can also be written
        requestData?: {}; // Data object to send with the request
		responseMapCallback?: (jsonObject: {}, xhr: JQueryXHR) => ViewModelResponseMapResult;
    }
	
	export interface ViewModelResponseMapResult {
		result: { [name: string]: any; };
		message?: string;
		errorCode?: number;
	}
    
    // Simple model event object
    //class ModelEvent<TModel extends Events.IEventDispatcher> extends Events.ObjectEvent<TModel> {}
	
	/**
	 * Direction in which the synchronisation happened (if server synchronisation happened).
	 */
	export enum ModelEventSyncDirection {
		/**
		 * Default direction if no server interaction occurred.
		 */
		Local,
		
		/**
		 * Read the model from the Server. (E.g. initial GET request.)
		 */
		Read,
		
		/**
		 * Write the model to the server. (E.g. POST when the model didn't yet exist)
		 */
		Write,
		
		/**
		 * Update an existing server model (PUT, PATCH etc.)
		 */
		Update
	}
	
	export interface ModelEventPropertyScope {
		propertyName: string;
		previousValue?: any;
		currentValue: any;
	}
	
	/**
	 * Model event representing a change in the model.
	 */
	export class ModelEvent<TModel extends ViewModel<any>> implements Events.IObjectEvent<TModel> {
		public constructor(
			private _originatingObject: TModel,
			private _eventName: string,
			private _direction: ModelEventSyncDirection,
			private _scope: ModelEventPropertyScope = null,
			private _resultMessage: string = null,
			private _resultCode: number = null
		) { }
		
		/**
		 * The name of the event that occurred.
		 */
		get EventName(): string {
			return this._eventName;
		}
		
		/**
		 * The model instance that send this event.
		 */
		get OriginatingObject(): TModel {
			return this._originatingObject;
		}
		
		/**
		 * The direction of the synchronisation or ModelEventSyncDirection.Local otherwise.
		 */
		get Direction(): ModelEventSyncDirection {
			return this._direction;
		}
		
		/**
		 * The scope of the model event (e.g. one property or the entire model). null means all properties were changed/the whole object was updated.
		 */
		get Scope(): ModelEventPropertyScope {
			return this._scope;
		}
		
		/**
		 * The result message of the server sync (If it occurred)
		 */
		get ResultMessage(): string {
			return this._resultMessage;
		}
		
		/**
		 * The result message of the server sync (If it occurred)
		 */
		get ResultCode(): number {
			return this._resultCode;
		}
		
		/**
		 * Stop the event from propagating to other event handlers.
		 */
		public StopPropagation(): void {
			this._originatingObject.StopCurrentEventPropagation();
		}
	}
    
    /**
	 * Lazy loading view-model
	 */
    export class ViewModel<TModel> extends Events.EventDispatcher {
        private _modelAttributes: string[] = [];
        private _modelValues: { [name: string]: any; } = null;
        private _modelDefaults: { [name: string]: any; } = null;
        private _modelUrl: string;
        private _options: ViewModelOptions;
        private _hasFetched: boolean = false;

		/**
		 * Create a new lazy loading view model.
		 * @param url
		 * @param options
		 * @constructor
		 */
        public constructor(url: string, options: ViewModelOptions = {}){
            super();
            this._modelUrl = url;
            if(options !== undefined && options !== null)
                this._options = options;
            else
                this._options = {};
        }
        
        /**
		 * Iterates over all user added properties and changes them to dynamic getters and setters, so sync and save are no longer required.
         * This is pretty cool stuff :)
		 */
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
        
        /**
		 * Identifier property if any, or null (No exceptions)
		 */
        public GetID(): any {
            if(this._options.identityProperty == undefined){
                if(_.contains(this._modelAttributes, 'id'))
                    return this._modelValues['id'];
                else return null;
            }else
                return this.LocalGet(this._options.identityProperty);
        }
        
        /**
		 * Will not try fetch the property if it isnt fetched yet
		 */
        //public SafeGet(name: string): any;
        public LocalGet(name: string): any {
            if(this._modelValues[name])
				return this._modelValues[name];
            else if(this._modelValues[this.UCFirst(name)] !== undefined)
				return this._modelValues[this.UCFirst(name)];
			return undefined;
        }
        
        /**
		 * Get the property or returns undefined
		 */
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
        
        /**
		 * Get the property or raise an exception
		 */
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
        
        /**
		 * Get multiple properties when they're available
		 */
        public AsyncGetAttributes(attributes: string[], success: (attributes: { [attribute:string]: any; }) => void): void {
            if(this._modelValues == null)
                this.Fetch(true, null, () => {
                    success(<any> _.pick(this._modelValues, attributes));
                });
            else
                success(<any> _.pick(this._modelValues, attributes));
        }
        
        /**
		 * Set the value of an value.
		 */
        public Set(name: string, value: any, preventEvent: boolean = false): void {
			var previousValue = this._modelValues[name];
            if(preventEvent != true)
                this.Dispatch('set', new ModelEvent(this, 'set', ModelEventSyncDirection.Local, {
                    propertyName: name,
                    previousValue: previousValue,
                    currentValue: value
                }));
            this._modelValues[name] = value;
            if(preventEvent != true)
				this.Dispatch('change', new ModelEvent(this, 'change', ModelEventSyncDirection.Local, {
					propertyName: name,
                    previousValue: previousValue,
                    currentValue: value
				}));
        }
        
        /**
		 * Fetch all data from the server for this viewmodel.
		 */
        public Fetch(async: boolean = true, options?: ViewModelOptions, success?: (model: TModel, resultCode: number, resultMessage: string) => void): void {
			console.log('Fetching model '+ this.GetType().Name +' '+(async?'a':'')+'synchronously from ' + this._modelUrl);
			$.ajax({
				dataType: "json",
				url: this._modelUrl,
				async: async,
				data: (options && options.requestData) ?
					_.merge({ id: this.GetID() }, options.requestData):
					{ id: this.GetID() },
				success: (jsonObj, status, xhr) => {
					this._hasFetched = true;
					
					var resultMessage = xhr.statusText;
					var resultCode = xhr.status;
					
					if(options.responseMapCallback && _.isFunction(options.responseMapCallback)){
						var mappedResult = <ViewModelResponseMapResult> options.responseMapCallback(jsonObj, xhr);
						if(_.isArray(mappedResult) || _.isUndefined(mappedResult))
							throw new Error('Model response mapping callback returned invalid result.');
						this._modelValues = mappedResult.result;
						resultCode = mappedResult.errorCode;
						resultMessage = mappedResult.message;
					}else this._modelValues = jsonObj;
					
					this.Dispatch('fetch', new ModelEvent(this, 'fetch', ModelEventSyncDirection.Read, null, resultMessage, resultCode));
					this.Dispatch('change', new ModelEvent(this, 'change', ModelEventSyncDirection.Read, null, resultMessage, resultCode));
					
					!!success ? success(<TModel> <any> this, resultCode, resultMessage) : null;
				}
			});
        }

		/**
		 * Update or create the server side representation for this model/object.
		 */
        public Save(): void {
			// @todo
			throw new Error('Not implemented');
		}

		/**
		 * Synchronise the server and local representation of this object.
		 *
		 * If the local object is not yet loaded it will fetch the object, if the local object has no id (null id) it will try and create it, etc.
		 */
        public Sync(): void {
			// @todo
			throw new Error('Not implemented');
		}
		
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
