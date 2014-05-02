/// <reference path="../ViewportManager.ts" />
/// <reference path="../PanelGroup.ts" />
/// <reference path="../Utils/ReferenceManager.ts" />

module Panels {
    export module Groups {
        /**
         * @abstract
         */
        export class ManagedPanelGroup<TViewportManager extends Panels.Viewport.IViewportManager, TExtendingPanelGroup extends ManagedPanelGroup<any, any>> extends Panels.PanelGroup implements Panels.IReferencedViewportPanelGroup, Events.IEventDispatcher {
            private _viewport: TViewportManager;
            private _rendered: boolean = false;
            private References: Panels.Utils.ReferenceManager;
            
            public get Viewport(): TViewportManager { return this._viewport; }
            public set Viewport(viewport: TViewportManager) { throw new Error('By default it\'s not possible to change the viewport manager after the object has been created.'); }
            
            public constructor(viewport: TViewportManager, private _defaultVisibility: boolean = true, maximalVisibleCount: number = 0) {
                super();
                this._viewport = viewport;
                this._viewport.SetElement(this.ContentElement);
                this.Panels = null;
                this.References = new Panels.Utils.ReferenceManager(maximalVisibleCount);
                (<any> this).InitEventSystem();
                
                // Helps you realise that you forgot to render.
                setTimeout(() => {
                    if(this._rendered == false)
                        console.warn('Did you forget to render the panelgroup "' + this.PanelName + '"? It has been 6 seconds since you created it...');
                }, 6000);
            }
            
            public Render(): void {
                if(this._rendered == false){
                    // First render
                    this._rendered = true;
                    // show all if default visible
                    if(this._defaultVisibility == true){
                        this._viewport.ArrangeInitial(
                            this.References.GetCurrentState()
                        );
                    }
                }
                this.References.GetVisible().Each(x => x.Panel.Render());
            }
            
            /**
    		 * Add an panel to the group.
    		 */
    		public AddPanel(panel: IPanel): void {
				if(PanelGroupHelper.IsPanelAttachable(panel))
					throw new RuntimeException('The panel given seems to already be attached to another group or structure within the dom. Please free it before adding it to another group.');
    		    var ref = this.MakeReference(panel);
    		    this.References.AttachRef(ref);
    		    this._viewport.Attach(ref);
    		    if(this._defaultVisibility)
    		        this.ShowByReference(ref);
    		}
			
			/**
			 * Detach a panel from the group.
			 */
			public DetachPanel(name: string): IPanel {
				var ref = this.References.GetRefByName(name);
				return this.DetachPanelByReference(ref);
			}
			
			/**
			 * Detach a panel from the group.
			 */
			public DetachPanelByReference(ref: Panels.PanelReference): IPanel {
				this._viewport.Detach(ref);
				this.References.DetachRef(ref);
				return ref.Panel;
				// @todo Hide the panel and wait for the animation completion before detaching the panel.
				// @todo invalidate the reference in a way that removes this group from the reference.
			}
    		
    		/**
    		 * Get a panel from the group by it's name.
    		 */
    		public GetPanel(name: string): IPanel {
    		    return this.References.GetRefByName(name).Panel;
    		}
    		
    		/**
    		 * Get a Panel of the specified type by the specified name.
    		 */
    		public GetTypedPanel<TPanel extends IPanel>(name: string): TPanel {
    		    return <TPanel> <any> this.References.GetRefByName(name).Panel;
    		}
    		
    		/**
    		 * Get all panels of the given type.
    		 */
    		public GetPanelsByType<TPanel extends IPanel>(type: any): TPanel[] {
    		    return this.References.GetRefsByPanelType<TPanel>(type);
    		}
    		
    		/**
    		 * Check if the group has a panel with the specified name.
    		 */
    		public HasPanel(name: string): boolean {
    		    if(name === undefined || name == '')
    		        return false;
    		    return this.References.HasRefByName(name);
    		}
            
            /**
             * Check if this PanelGroup contains the given panel.
             */
            public HasPanelByReference(ref: Panels.PanelReference): boolean {
                if(ref === undefined || ref === null)
                    return false;
                return this.References.HasRef(ref);
            }
            
            /**
             * Show a panel in view.
             */
            public Show(name: string): void {
                if(this.References.HasRefByName(name))
                    this.ShowByReference(this.NameToReference(name));
                else throw new UnknownPanelException();
            }
            
            /**
             * Show a panel by its reference object.
             */
            public ShowByReference(ref: Panels.PanelReference): void{
                if(this.HasPanelByReference(ref)){
                    if(this._rendered){
                        this._viewport.Arrange(
                            this.References.TrackChanges(() => {
                                this.References.SetVisibility(ref, true);
                            }, this._viewport.GetAnimationDirectionProvider())
                        );
                    }else{
                        this.References.SetVisibility(ref, true);
                    }
                    
                    // Dispatch event AFTER the view change.
                    this.Dispatch('show', new PanelGroupVisibilityEvent<TExtendingPanelGroup>(<any> this, 'show', ref));
                }else throw new UnknownPanelException();
            }
            
            /**
             * Hide a Panel from view.
             */
            public Hide(name: string): void {
                if(this.References.HasRefByName(name))
                    this.HideByReference(this.NameToReference(name));
                else
                    throw new UnknownPanelException();
            }
            
            /**
             * Hide a panel by its reference object.
             */
            public HideByReference(ref: Panels.PanelReference): void{
                if(this.HasPanelByReference(ref)){
                    if(this._rendered){
                        this._viewport.Arrange(
                            this.References.TrackChanges(() => {
                                this.References.SetVisibility(ref, false);
                            }, this._viewport.GetAnimationDirectionProvider())
                        );
                    }else{
                        this.References.SetVisibility(ref, false);
                    }
                    
                    // Dispatch event AFTER the view change.
                    this.Dispatch('hide', new PanelGroupVisibilityEvent<TExtendingPanelGroup>(<any> this, 'hide', ref));
                }else throw new UnknownPanelException();
            }
            
            /**
             * Check if a panel is shown in the current viewport.
             */
            public IsVisible(name: string): boolean {
                return this.IsVisibleByReference(this.NameToReference(name));
            }
            
            /**
             * Check if a panel is visible by checking it's reference.
             */
            public IsVisibleByReference(ref: Panels.PanelReference): boolean {
                return this.References.IsVisible(ref);
            }
            
            /**
             * Place multiple panels in the viewport in the given order, hiding any other attached panels.
             */
            public Place(names: string[]): void {
                var places = [];
                for(var i=0; i<names.length; i++){
                    if(this.HasPanel(names[i]))
                        places.push(this.NameToReference(names[i]));
                    else throw new UnknownPanelException();
                }
                this.PlaceByReferences(places);
            }
            
            /**
             * Place multiple panels in the viewport in the given order, hiding any other attached panels.
             */
            public PlaceByReferences(refs: Panels.PanelReference[]): void {
                // Track the changes the refs imply.
                var changes =
                    this.References.TrackChanges(() => {
                        this.References.SetVisibilityAll(false);
                        for(var i=0; i<refs.length; i++){
                            if(this.References.HasRef(refs[i]))
                                this.References.SetVisibility(refs[i], true);
                            else
                                throw new KeyNotFoundException();
                        }
                    }, this._viewport.GetAnimationDirectionProvider());
                
                // Only apply the animations when the panel is already rendered.
                if(this._rendered){
                    this._viewport.Arrange(changes);
                }
                
                // Dispatch event AFTER the view change.
                changes.Each(x => {
                    if(x.PreviousVisibility != x.Visibility){
                        if(x.Visibility == true)
                            this.Dispatch('show', new PanelGroupVisibilityEvent<TExtendingPanelGroup>(<any> this, 'show', x.Reference));
                        else
                            this.Dispatch('hide', new PanelGroupVisibilityEvent<TExtendingPanelGroup>(<any> this, 'hide', x.Reference));
                    }
                });
            }
            
            /**
             * Convert an Panel associated with this group to an reference.
             */
            private NameToReference(name: string): Panels.PanelReference {
                return this.References.GetRefByName(name);
            }
            
            private MakeReference(panel: Panels.IPanel): Panels.PanelReference {
                return new Panels.PanelReference(panel, this);
            }
            
            //#section IEventDispatcher Impl.
            /**
    		 * Trigger an object event.
    		 */
    		Dispatch(eventName: string, event: Events.IObjectEvent<Events.IEventDispatcher>): void { throw new MethodNotOverwrittenException(); }
    		
    		/**
    		 * Attach an event consumer object
    		 */
    		Consume(consumer: Events.IEventConsumer, events?: string[]): void { throw new MethodNotOverwrittenException(); }
    		
    		/**
    		 * Remove an event consumer object
    		 */
    		Starve(consumer: Events.IEventConsumer, events?: string[]): void { throw new MethodNotOverwrittenException(); }
    		
    		/**
    		 * Register a single callback for a single event
    		 */
    		Attach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void { throw new MethodNotOverwrittenException(); }
    		
    		/**
    		 * Remove an attached event
    		 */
    		Detach(callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void, events?: string[]): void { throw new MethodNotOverwrittenException(); }
    		
    		/**
    		 * Shorthand for Attach, use exectly like the jQuery exuivalent
    		 */
    		On(eventNames: string, callback: (event: Events.IObjectEvent<Events.IEventDispatcher>) => void): void { throw new MethodNotOverwrittenException(); }
            
    		/**
    		 * Stop the current event cycle from bubbling further down the attached events.
    		 */
    		StopCurrentEventPropagation(): void { throw new MethodNotOverwrittenException(); }
    		//#endsection
        }
        Events.CopyEventDispatcherPrototype(ManagedPanelGroup);
        
        export class PanelGroupVisibilityEvent<TManagedPanelGroup extends ManagedPanelGroup<any, any>> implements Events.IObjectEvent<TManagedPanelGroup> {
    		public constructor(private _originatingObject: TManagedPanelGroup, private _eventName: string, private _panelReference: Panels.PanelReference) { }
    		
    		get EventName(): string {
    			return this._eventName;
    		}
    		
    		get OriginatingObject(): TManagedPanelGroup {
    			return this._originatingObject;
    		}
    		
    		get PanelName(): string {
    			return this._panelReference.PanelName;
    		}
    		
    		get PanelReference(): Panels.PanelReference {
    		    return this._panelReference;
    		}
    		
    		public StopPropagation(): void {
    			this._originatingObject.StopCurrentEventPropagation();
    		}
    	}
    }
}