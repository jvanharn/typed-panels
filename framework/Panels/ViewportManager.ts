/// <reference path="Utils/PanelReference.ts" />
/// <reference path="../Collections/Tuple.ts" />
/// <reference path="../Collections/List.ts" />
/// <reference path="../../defs/jquery.d.ts" />
module Panels {
    export module Viewport {
        export interface PanelViewportState {
            /**
             * Whether or not the current panel is visible.
             */
            Visibility: boolean;
            
            /**
             * Reference to the Panel object.
             */
            Reference: Panels.PanelReference;
            
            /**
             * Numeric representation of the position of this element.
             */
            Position: number;
        }
        
        export interface PanelViewportStateChange extends PanelViewportState {
            /**
             * Whether or not any changes to this panels visibility or position where made anyway. (Can be used as shortcut)
             */
            Changed: boolean;
            
            /**
             * The previous visibility.
             */
            PreviousVisibility: boolean;
            
            /**
             * The old position of the Element.
             */
            PreviousPosition: number;
            
            /**
             * The difference between the current position and old position.
             */
            Moves: number;
            
            /**
             * Direction in which the panel moves. (or null when Moves=0)
             */
            MovementDirection: Direction;
            
            /**
             * (Optional) The direction in which the element has to be animated (Only filled if the ViewportManager provided an animationDirectionCallback)
             */
            AnimationDirection: Side;
        }
        
        /**
         * Defines the side towards which a Direction is aimed.
         */
        export enum Side {
            Left, Right, Top, Down
        }
        
        /**
         * Defines what direction a movement is going.
         */
        export enum Direction {
            Forward, Backward, Sidewards
        }
        
        /**
         * Viewport Manager Interface
         */
        export interface IViewportManager {
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            SetElement(viewportElement: JQuery): void;
            
            /**
             * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
             */
            Attach(ref: Panels.PanelReference): void;
            /**
             * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
             */
            Detach(ref: Panels.PanelReference): void;
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             */
            IsAttached(ref: Panels.PanelReference): boolean;
            
            /**
             * Arrange the given panels in the viewport.
             */
            Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>): void;
            
            /**
             * Arrange the panels in the viewport for the first render of the panelgroup.
             */
            ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
            
            /**
             * If the ViewportManager wants to know/relies on the AnimationPanelViewportState.AnimationDirection property, this method should return an callback that can process each element for the animation direction.
             * @return function|null
             */
            GetAnimationDirectionProvider(): (stateChange: PanelViewportStateChange) => Direction;
        }
    }
}