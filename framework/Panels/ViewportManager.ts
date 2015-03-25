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
             * (Optional) The direction in which the element has to be animated.
             */
            AnimationDirection: Side;
        }

		/**
		 * Defines the orientation of an axisbound operation.
		 */
		export enum Orientation {
			Horizontal,
			Vertical
		}
        
        /**
         * Defines the side towards which a Direction is aimed.
         */
        export enum Side {
            Left, Right, Top, Down
        }

		export class ViewportException extends RuntimeException {}
		export class InvalidViewportArrangementException extends ViewportException {}

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
			 *
			 * Behaviour:
			 *  - Detaching a panel is only possible if it is not currently visible in/placed inside the viewport. Otherwise the method should raise a ViewportException.
			 * @param ref The reference to detach.
             */
            Detach(ref: Panels.PanelReference): void;
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             */
            IsAttached(ref: Panels.PanelReference): boolean;
			/**
			 * Whether or not the given panel is attached to this manager and is visible in the viewport.
			 * @param ref Reference to check.
			 */
			IsVisible(ref: Panels.PanelReference): boolean;
            
            /**
             * Arrange the given panels in the viewport.
			 *
			 * The given arrangement *should* include _every panel that is in the viewport_ even if only
			 *
			 * Behaviour:
			 *  - The ViewportManager *should* raise an InvalidViewportArrangementException when the arrangement does not include every panel from the previous/current viewport arrangement.
			 * @param arrangement The panels and their position and visibility in the viewport.
             */
            Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>, doneCallback): void;

			/**
             * Arrange the given panels in the viewport for the initial panel setup.
			 * @param arrangement The panels and their position and visibility in the viewport.
             */
            ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void;
        }
    }
}