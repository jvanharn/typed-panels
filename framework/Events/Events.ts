/// <reference path="../Collections/Dictionary.ts" />
/// <reference path="../Collections/List.ts" />
/// <reference path="../BaseObject.ts" />
module Events {
    /**
     * Dispatches events to event listeners.
     */
	export interface IEventDispatcher {
		/**
		 * Trigger an object event.
		 */
		Dispatch(eventName: string, event: IObjectEvent<IEventDispatcher>): void;
		
		/**
		 * Attach an event consumer object
		 */
		Consume(consumer: IEventConsumer, events?: string[]): void;
		
		/**
		 * Remove an event consumer object
		 */
		Starve(consumer: IEventConsumer, events?: string[]): void;
		
		/**
		 * Register a single callback for a single event
		 */
		Attach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
		
		/**
		 * Remove an attached event
		 */
		Detach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void;
		
		/**
		 * Shorthand for Attach, use exectly like the jQuery exuivalent
		 */
		On(eventNames: string, callback: (event: IObjectEvent<IEventDispatcher>) => void): void;
        
		/**
		 * Stop the current event cycle from bubbling further down the attached events.
		 */
		StopCurrentEventPropagation(): void;
	}
	
	/**
	 * Listens to IEventDispatcher
	 */
	export interface IEventConsumer {
		ConsumeEvent(event: IObjectEvent<IEventDispatcher>): void;
	}
	
	/**
	 * Generic event
	 */
	export interface IObjectEvent<TObject extends IEventDispatcher> {
		EventName: string;
		OriginatingObject: TObject;
		
		StopPropagation(): void;
	}
	
	/**
	 * Simple Implementation, only works with EventDispatcher extending objects
	 */
	export class ObjectEvent<TEventDispatcher extends IEventDispatcher> implements IObjectEvent<TEventDispatcher> {
		public constructor(private _originatingObject: TEventDispatcher, private _eventName: string, private _data: any = {}) { }
		
		get EventName(): string {
			return this._eventName;
		}
		
		get OriginatingObject(): TEventDispatcher {
			return this._originatingObject;
		}
		
		get Data(): any {
			return this._data;
		}
		
		public StopPropagation(): void {
			this._originatingObject.StopCurrentEventPropagation();
		}
	}
	
	/**
	 * Basic Implementation of an IEventDispatcher
	 * @abstract
	 */
	export class EventDispatcher extends BaseObject implements IEventDispatcher {
	    public static WildcardEvent: string = '*';
		EventConsumers: Collections.Dictionary<string, Collections.List<IEventConsumer>>
		    = new Collections.Dictionary<string, Collections.List<IEventConsumer>>();
		EventDelegates: Collections.Dictionary<string, Collections.List<(event: IObjectEvent<IEventDispatcher>) => void>>
		    = new Collections.Dictionary<string, Collections.List<(event: IObjectEvent<IEventDispatcher>) => void>>();
		PropagationCanceled: boolean = false;
        
		/**
		 * Trigger an object event.
		 */
		Dispatch(eventName: string, event: IObjectEvent<IEventDispatcher>): void {
			this.PropagationCanceled = false; // Ignore any canceling
			// Consumers
			if(this.EventConsumers.Count > 0) {
    			this.EventConsumers
    			    .Where(eventConsumer => eventConsumer.Key == eventName || eventConsumer.Key == EventDispatcher.WildcardEvent)
    			    .BreakableEach(eventConsumer => {
    			        if(this.PropagationCanceled == true)
            			    return false;
        			    eventConsumer.Value.BreakableEach(eventConsumer => {
            			    if(this.PropagationCanceled == true) {
            			        //this.PropagationCanceled = false; // now gets done at the end, so consumer events can also cancel delegated event handlers.
            			        return false;
            			    }
            			    eventConsumer.ConsumeEvent(event);
        			    });
    			    });
			}
			// Simple delegates
			if(this.EventDelegates.Count > 0 && this.PropagationCanceled == false) {
    			this.EventDelegates
    			    .Where(eventDelegate => eventDelegate.Key == eventName || eventDelegate.Key == EventDispatcher.WildcardEvent)
    			    .BreakableEach((eventDelegate, qr) => {
        			    eventDelegate.Value.BreakableEach(eventDelegate => {
            			    if(this.PropagationCanceled == true)
            			        return false;
            			    eventDelegate(event);
        			    });
        			    if(this.PropagationCanceled == true) {
        			        this.PropagationCanceled = false;
            			    return false;
        			    }
    			    });
			}
		}
		
		/**
		 * Add consumer
		 */
		public Consume(consumer: IEventConsumer, events?: string[]): void {
		    if(consumer.ConsumeEvent == undefined) {
		        throw new Error('Invalid consumer object given');
		    }
		    if(events == undefined)
		        events = [EventDispatcher.WildcardEvent];
		    _.each(events, (item) => {
		        if(!this.EventConsumers.ContainsKey(item))
		            this.EventConsumers.Set(
		                item,
		                new Collections.List<IEventConsumer>()
		            );
		        this.EventConsumers.Get(item).Add(consumer);
		    });
		}
		
		/**
		 * Remove consumer
		 */
		public Starve(consumer: IEventConsumer, events?: string[]): void {
			if(events == undefined){
			    this.EventConsumers.Each(item => {
			        item.Value.Remove(consumer);
    		    });
			} else {
    		    _.each(events, item => {
    		        if(this.EventConsumers.ContainsKey(item))
    		            this.EventConsumers.Get(item).Remove(consumer);
    		    });
			}
		}
		
		/**
		 * Register a single callback for a single event
		 */
		public Attach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void {
		    if(events == undefined)
		        events = [EventDispatcher.WildcardEvent];
		    _.each(events, item => {
		        if(!this.EventDelegates.ContainsKey(item))
		            this.EventDelegates.Set(
		                item,
		                new Collections.List<(event: IObjectEvent<IEventDispatcher>) => void>()
		            );
		        this.EventDelegates.Get(item).Add(callback);
		    });
		}
		
		/**
		 * Remove an attached event
		 */
		public Detach(callback: (event: IObjectEvent<IEventDispatcher>) => void, events?: string[]): void {
		    throw new NotImplementedException();
		}
		
		/**
		 * Shorthand for Attach, use exectly like the jQuery exuivalent
		 * Eventnames is a space separated list of events to bind.
		 */
		public On(eventNames: string, callback: (event: IObjectEvent<IEventDispatcher>) => void): void {
		    var events = eventNames.split(' ');
			this.Attach(callback, events);
		}

		/**
		 * Stop the current event cycle from bubling further down the attached events.
		 */
		public StopCurrentEventPropagation(): void {
			this.PropagationCanceled = true;
		}
	}
	
	/**
	 * Copies the Event Dispatcher methods to the class, so we can work around the single inheritance limitation.
	 * IMPOTANT!: Also call this.InitEventSystem() in the constructor.
	 */
	export function CopyEventDispatcherPrototype(eventDispatcherImpl: Function): void {
	    // ------------ COPY PROTOTYPE --------------
        // Because im not really gonna copy and paste the entire event class, but I /do/ want multiple inheritance im gnna copy them to thi class's prototype.
        (<Function> <any> eventDispatcherImpl).prototype.InitEventSystem = function(){
            this.EventConsumers = new Collections.Dictionary<string, Collections.List<IEventConsumer>>();
		    this.EventDelegates = new Collections.Dictionary<string, Collections.List<(event: IObjectEvent<IEventDispatcher>) => void>>();
		    this.PropagationCanceled = false;
        };
        (<Function> <any> eventDispatcherImpl).prototype.Dispatch                       = EventDispatcher.prototype.Dispatch;
        (<Function> <any> eventDispatcherImpl).prototype.Consume                        = EventDispatcher.prototype.Consume;
        (<Function> <any> eventDispatcherImpl).prototype.Starve                         = EventDispatcher.prototype.Starve;
        (<Function> <any> eventDispatcherImpl).prototype.Attach                         = EventDispatcher.prototype.Attach;
        (<Function> <any> eventDispatcherImpl).prototype.Detach                         = EventDispatcher.prototype.Detach;
        (<Function> <any> eventDispatcherImpl).prototype.On                             = EventDispatcher.prototype.On;
        (<Function> <any> eventDispatcherImpl).prototype.StopCurrentEventPropagation    = EventDispatcher.prototype.StopCurrentEventPropagation;
	}
}