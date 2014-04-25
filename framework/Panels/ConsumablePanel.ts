/// <reference path="../Events/Events.ts" />
module Panels {
    /**
     * @abstract
     */
    export class ConsumablePanel extends Panel implements Events.IEventDispatcher {
        EventConsumers: Collections.Dictionary<string, Collections.List<Events.IEventConsumer>>
		    = new Collections.Dictionary<string, Collections.List<Events.IEventConsumer>>();
		EventDelegates: Collections.Dictionary<string, Collections.List<(event: Events.IObjectEvent<Events.IEventDispatcher>) => void>>
		    = new Collections.Dictionary<string, Collections.List<(event: Events.IObjectEvent<Events.IEventDispatcher>) => void>>();
		PropagationCanceled: boolean = false;
		
        /**
		 * Trigger an object event.
		 */
		Dispatch(eventName: string, event: Events.IObjectEvent<Events.IEventDispatcher>): void { throw new Error('Prototype copying failed.'); }
		
		/**
		 * Attach an event consumer object
		 */
		Consume(consumer: Events.IEventConsumer, events?: string[]): void { throw new Error('Prototype copying failed.'); }
		
		/**
		 * Remove an event consumer object
		 */
		Starve(consumer: Events.IEventConsumer, events?: string[]): void { throw new Error('Prototype copying failed.'); }
		
		/**
		 * Register a single callback for a single event
		 */
		Attach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void { throw new Error('Prototype copying failed.'); }
		
		/**
		 * Remove an attached event
		 */
		Detach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void { throw new Error('Prototype copying failed.'); }
		
		/**
		 * Shorthand for Attach, use exectly like the jQuery exuivalent
		 */
		On(eventNames: string, callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void): void { throw new Error('Prototype copying failed.'); }
        
		/**
		 * Stop the current event cycle from bubbling further down the attached events.
		 */
		StopCurrentEventPropagation(): void { throw new Error('Prototype copying failed.'); }
    }
    
    Events.CopyEventDispatcherPrototype(ConsumablePanel);
}