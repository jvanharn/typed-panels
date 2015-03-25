module Panels {
    export module Utils {
        interface ManagedReferenceItem {
            Reference: Panels.PanelReference;
            Visible: boolean;
        }

        /**
         * INTERNAL CLASS
         * Used for easily managing references and reordering them in place.
         * @access protected
         */
        export class ReferenceManager extends BaseObject {
            private References: Collections.List<ManagedReferenceItem> = new Collections.List<ManagedReferenceItem>();
            
            public constructor(private maximalVisibleCount: number = 0){
                super();
            }
            
            public EachRef(callback: (ref: Panels.PanelReference, visibility: boolean) => void): void {
                this.References.Each(x => callback(x.Reference, x.Visible));
            }
            
            public AttachRef(ref: Panels.PanelReference): void {
                this.References.Add({
                    Reference: ref,
                    Visible: false
                });
            }
            
            public DetachRef(ref: Panels.PanelReference): void {
                this.References.RemoveAll(x => x.Reference.Equals(ref));
            }
            
            public HasRef(ref: Panels.PanelReference): boolean {
                return this.References.Any(x => x.Reference.Equals(ref));
            }
            
            public HasRefByName(name: string): boolean {
                return this.References.Any(x => x.Reference.PanelName == name);
            }
            
            public GetRefByName(name: string): Panels.PanelReference {
                try {
                    return this.References.First(x => x.Reference.PanelName == name).Reference;
                }catch(e){
                    console.warn(e);
                    throw new KeyNotFoundException('Panel reference not found.');
                }
            }
            
            public GetRefsByPanelType<TPanel extends IPanel>(type: any): TPanel[] {
                return <TPanel[]> <any> this.References
                                            .Select(x => x.Reference.Panel)
                                            .Where(x => x instanceof type)
                                            .ToArray();
            }
            
            public PositionOfRef(ref:Panels.PanelReference): number {
                return this.References.IndexOfFirst(x => x.Reference.Equals(ref));
            }
            
            /**
             * Move the given element one place back in the list.
             */
            public MoveBack(ref: Panels.PanelReference): void {
                var i = this.PositionOfRef(ref);
                var elem = this.References.ElementAt(i);
                this.References.RemoveAt(i);
                this.References.Insert(i-1, elem);
            }
            
            /**
             * Move the given element one place forward in the list.
             */
            public MoveForward(ref: Panels.PanelReference): void {
                var i = this.PositionOfRef(ref);
                var elem = this.References.ElementAt(i);
                this.References.RemoveAt(i);
                this.References.Insert(i+1, elem);
            }
            
            /**
             * Move the given ref to the given index.
             */
            public MoveTo(ref: Panels.PanelReference, index: number): void {
                if(index > this.References.Count)
                    throw new Error('ReferenceManager; Index out of bounds.');
                var i = this.PositionOfRef(ref);
                var elem = this.References.ElementAt(i);
                this.References.RemoveAt(i);
                this.References.Insert(index, elem);
            }
            
            /**
             * Get all panels that are visible in the viewport.
             */
            public GetVisible(): Collections.List<Panels.PanelReference> {
                return <Collections.List<Panels.PanelReference>> this.References.Where(x => x.Visible === true).Select(x => x.Reference);
            }
            
            /**
             * Check if a panel is visible or not.
             */
            public IsVisible(ref: Panels.PanelReference): boolean{
                return this.References.FirstOrDefault(
					{ Reference: null, Visible: null },
					x => x.Reference.Equals(ref)
				).Visible;
            }
            
            public SetVisibility(ref: Panels.PanelReference, visibility: boolean): void {
                try {
                    this.References.First(x => x.Reference.Equals(ref)).Visible = visibility;
                }catch(e){
                    console.warn(e); // just for debugging.
                }
            }
            
            public SetVisibilityAll(visibility: boolean): void {
                this.References.Each(x => x.Visible = visibility);
            }
            
            public GetCurrentState(): Collections.Enumerable<Panels.Viewport.PanelViewportState> {
                var cnt = 0;
                return this.References.Select<Panels.Viewport.PanelViewportState>(
                        x => {
                            return {
                                Visibility: x.Visible,
                                Reference: x.Reference,
                                Position: (x.Visible ? cnt++ : null)
                            };
                        }
                    );
            }
            
            /**
             * Iterate over all panels in the dictionary returning an array with the corrected order and how each reference was mutated.
             * @return <Panel, Direction of animation, Places Moved, oldVisibility> 
             */
            public TrackChanges(callback: () => void, animationDirectionCallback: (stateChange: Panels.Viewport.PanelViewportStateChange) => void = null): Collections.Enumerable<Panels.Viewport.PanelViewportStateChange> {
                // Make a snapshot of the current situation
                var before: Collections.Enumerable<Panels.Viewport.PanelViewportState> = this.GetCurrentState();
                
                // Do the requested stuff
                callback();
                
                // Make sure there were no references attached or detached.
                if(before.CountAll() != this.References.Count)
                    throw new RuntimeException('Sorry I cannot track changes when refs are detached or atached.');
                
                // Calculate the differences and return
                var pos = 0;
                return this.References.Select<Panels.Viewport.PanelViewportStateChange>(changedItem => {
                    var previousState = before.First(x => x.Reference.Equals(changedItem.Reference));
                    var newPosition = changedItem.Visible ? pos++ : null;
                    var stateChange: Panels.Viewport.PanelViewportStateChange = {
                        Reference: changedItem.Reference,
                        Visibility: changedItem.Visible,
                        Position: newPosition,
                        
                        Changed: (
                            previousState.Position != newPosition ||
                            previousState.Visibility != changedItem.Visible
                        ),
                        
                        PreviousPosition: previousState.Position,
                        PreviousVisibility: previousState.Visibility,
                        
                        //Moves: previousState.Position - newPosition,
                        //MovementDirection: ((newPosition > previousState.Position) ? Panels.Viewport.Direction.Forward : Panels.Viewport.Direction.Backward),
                        AnimationDirection: null
                    };
                    
                    if(animationDirectionCallback != null)
                        animationDirectionCallback(stateChange);
                    
                    return stateChange;
                });
            }
            /*public TrackChanges(callback: () => void, ori: Orientation = Orientation.Horizontal): Collections.Quadruple<Panels.PanelReference, AnimationDirection, number, boolean>[] {
                var before: Collections.List<Collections.Pair<Panels.PanelReference, boolean>> = <any> this.Select<Collections.Pair<Panels.PanelReference, boolean>>((value) => {
                    return new Collections.Pair<Panels.PanelReference, boolean>(value.Value1, value.Value2);
                });
                
                callback.bind(this)();
                if(before.Count != this.Items.length)
                    throw new Error('Sorry I cannot track changes when refs are detached or atached.');
                
                var changes: Collections.Quadruple<Panels.PanelReference, AnimationDirection, number, boolean>[] = [];
                for(var i=0; i<this.Items.length; i++){
                    var indexBefore = before.FirstIndex(x => x.Value1 == this.Items[i].Value1);
                    var itemBefore = before.ElementAt(indexBefore);
                    var indexAfter = i;
                    var itemAfter = this.Items[i];
                    var movement = indexAfter-indexBefore;
                    var direction: AnimationDirection;
                    switch(ori) {
                        case Orientation.Vertical:
                            if(itemBefore.Value2 == itemAfter.Value2) // NOne
                                direction = AnimationDirection.None;
                            else if(itemBefore.Value2 == true && itemAfter.Value2 == false) // Out
                                direction = AnimationDirection.Left;
                            else if(itemBefore.Value2 == false && itemAfter.Value2 == true) // In
                                direction = AnimationDirection.Right;
                            break;
                        case Orientation.Horizontal:
                        default:
                            if(itemBefore.Value2 == itemAfter.Value2) // NOne
                                direction = AnimationDirection.None;
                            else if(itemBefore.Value2 == true && itemAfter.Value2 == false) // Out
                                direction = AnimationDirection.Down;
                            else if(itemBefore.Value2 == false && itemAfter.Value2 == true) // In
                                direction = AnimationDirection.Up;
                            break;
                    }
                    changes.push(new Collections.Quadruple<Panels.PanelReference, AnimationDirection, number, boolean>(
                        this.Items[i].Value1,
                        direction,
                        movement,
                        itemBefore.Value2
                    ));
                }
                return changes;
            }*/
        }
    }
}