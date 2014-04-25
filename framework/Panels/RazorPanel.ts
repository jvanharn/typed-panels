module Panels {
    /**
     * Panel that get's rendered from a Razor View and can have specific elements replaced/updated on specific events.
     * @abstract
     */
    export class RazorPanel extends Panel implements Events.IEventConsumer {
        /**
         * Whether or not the main razor template was already loaded and rendered. (When this is true only partials are rerendered.)
         */
        private _rendered: boolean = false;
        
        /**
         * List of partial IDs that have been rendered right now.
         */
        private RenderedPartials: number[] = [];
        
        /**
         * Check whether or not the first/main renderer has already taken place.
         */
        get IsRendered(): boolean { return this._rendered; }
        
        public constructor(private _partialUrl: string, private _updateUrl: string) {
            super();
        }
        
        /**
         * Determines what to render.
         */
        public Render(): void {
            if(!this._rendered){
                this._rendered = true;
                this.MainRenderer();
            }else console.log('Render request on razor panel "'+this.PanelName+'"['+this.PanelSeqId+'] has been ignored because the panel has already been rendered, only partial update events are accepted now.');
        }
        
        /**
         * Call this method to force the panel to refetch the main razor template. Use this if the partial updating went wrong, etc.
         */
        public ForceRerender(): void {
            this.MainRenderer();
        }
        
        /**
         * This method is called after the rendering of every partial piece of the panel. It can be used to add click events etc.
         * @abstract
         */
        public ProcessPartialRender(partialId: number, partialElement: JQuery): void {
            throw new AbstractMethodException();
        }
        
        /**
         * Renders the main razor panel.
         * @access protected
         */
        private MainRenderer(): void {
            this.FetchRazor((elem) => {
                this.ContentElement.empty();
                this.ContentElement.append(elem);
                
                // loop over nested partials
                this.ContentElement.find('div[data-partialid]').each((i, elem) => {
                    var partialId = parseInt(elem.getAttribute('data-partialid'), 10);
                    this.ProcessPartialRender(partialId, jQuery(elem));
                });
            });
        }
        
        /**
         * Rerenders/updates parts of the main rendered dom with partial templates.
         * @access protected
         */
        private PartialRenderer(partialId: number, html?: JQuery): void {
            var replacedElement: JQuery;
            if(_.contains(this.RenderedPartials, partialId))
                replacedElement = this.ContentElement.find('div[data-partialid='+partialId+']');
            else
                replacedElement = this.ContentElement.append('<div class="temp-partial">'); // just add a bogey elem at the end
            
            if(html === undefined){
                this.FetchRazor(elem => {
                    replacedElement.replaceWith(elem);
                    this.ProcessPartialRender(partialId, elem);
                }, partialId);
            }else{
                replacedElement.replaceWith(html);
                this.ProcessPartialRender(partialId, html);
            }
        }
        
        /**
         * Fetch the contents of a razor compiled template. Give an partialId
         */
        private FetchRazor(callback: (elem: JQuery) => void, partialId?: number): void {
            if(partialId === undefined)
                jQuery.get(
                    this._partialUrl,
                    null,
                    function(data) {
                        callback(jQuery(data));
                    },
                    'html'
                );
            else
                jQuery.get(
                    this._partialUrl,
                    { id: partialId },
                    function(data) {
                        callback(jQuery(data));
                    },
                    'html'
                );
        }
        
        /**
         * 
         */
        public ConsumeEvent(event: Events.IObjectEvent<any>): void {
            var renderEvent:RazorPartialUpdateEvent = (<RazorPartialUpdateEvent> event);
            if(!(event instanceof RazorPartialUpdateEvent)){
                var mapped = this.EventMapper(event);
                if(mapped != null)
                    renderEvent = mapped;
                else return;
            }
            
            if(!_.contains(this.RenderedPartials, renderEvent.PartialId)){
                if(renderEvent.PartialHtml !== undefined)
                    this.PartialRenderer(renderEvent.PartialId, renderEvent.PartialHtml);
                else // Discard this unusable update
                    console.warn('Improperly filled RazorPartialUpdateEvent was fired;', renderEvent);
            }else{
                if(renderEvent.PartialHtml !== undefined)
                    this.PartialRenderer(renderEvent.PartialId, renderEvent.PartialHtml);
                else
                    this.PartialRenderer(renderEvent.PartialId);
            }
        }
        
        /**
         * This is the event mapper. It makes it possible for you to map an non razor event to an Razor event.
         * If this method returns null it will discard/ignore the event.
         * @abstract
         */
        public EventMapper(event: Events.IObjectEvent<any>): RazorPartialUpdateEvent {
            return null;
        }
    }
    
    export class RazorPartialUpdateEvent implements Events.IObjectEvent<any> {
        public constructor(private _originatingObject: any, private _eventName: string, private _partialId: number, private _partialHtml?: JQuery) { }
		
		get EventName(): string {
			return this._eventName;
		}
		
		get OriginatingObject(): any {
			return this._originatingObject;
		}
		
		/**
		 * The Id number of an existing partial to update, or another positive number to add the element at the end or beginning.
		 */
		get PartialId(): number {
			return this._partialId;
		}
		
		/**
		 * Optionally provide the HTML to fill the partial with, instead of asking the server for the content
		 */
		get PartialHtml(): JQuery {
			return this._partialHtml;
		}
		
		public StopPropagation(): void {
			this._originatingObject.StopCurrentEventPropagation();
		}
    }
}