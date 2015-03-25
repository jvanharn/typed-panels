/// <reference path="../ComposedViewportManager.ts" />

module Panels {
    export module Viewport {
		export module Composition {
			export class TilingViewportComposition implements Panels.Viewport.IViewportComposition {
				/**
				 * The orientation of this composition. Must be settable and gettable.
				 *
				 * If changed for a composing run, will always be set first. Ergo, this will be set to the changed value, and compose will be called afterwards.
				 * The composition is allowed to not accept orientation changes, and must then fire a ViewportOrientationChangeException.
				 */
				public Orientation: Panels.Viewport.Orientation;

				/**
				 * Decides the order and size of panels in a viewport.
				 * @param panels The panels from the group that have to be composed
				 * @param initialOrdering Whether or not this is the first time the composition is being made for the current Group.
				 * @return A collection of viewport state changes that have to be made to the viewport, in order to reach the desired composition for this type of ViewportComposition.
				 */
				public Compose(panels: Collections.Enumerable<ComposedPanelViewportState>, initialOrdering: boolean = false): Collections.Enumerable<ComposedPanelViewportStateChange> {
					return null;
				}
			}
		}
	}
}