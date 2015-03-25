/// <reference path="../../../defs/jquery.d.ts" />
/// <reference path="../ViewportManager.ts" />
/// <reference path="Composition/TilingViewportComposition.ts" />

module Panels {
    export module Viewport {
		export interface ComposedPanelViewportState extends PanelViewportState {
			/**
			 * The size of this Panel in the composition.
			 *
			 * Floating point percentage; 1.00 = 100% in size, 0.12 = 12% in size. Width or height, depends on the orientation.
			 * If not set defaults to (1.00 / totalNumberOfPanels)
			 */
			Size: number;
		}

		export interface ComposedPanelViewportStateChange extends PanelViewportStateChange, ComposedPanelViewportState {
			/**
			 * The previous size of this Panel in the composition, before it was changed.
			 *
			 * The same as Size if unchanged. Also detectable by the Changed boolean.
			 * Floating point percentage; 1.00 = 100% in size, 0.12 = 12% in size. Width or height, depends on the orientation.
			 */
			PreviousSize: number;
		}

        export interface IViewportComposition {
			/**
			 * The orientation of this composition. Must be settable and gettable.
			 *
			 * If changed for a composing run, will always be set first. Ergo, this will be set to the changed value, and compose will be called afterwards.
			 * The composition is allowed to not accept orientation changes, and must then fire a ViewportOrientationChangeException.
			 */
			Orientation: Panels.Viewport.Orientation;

			/**
			 * Decides the order and size of panels in a viewport.
			 * @param panels The panels from the group that have to be composed
			 * @param initialOrdering Whether or not this is the first time the composition is being made for the current Group. (Defaults to false)
			 * @return A collection of viewport state changes that have to be made to the viewport, in order to reach the desired composition for this type of ViewportComposition.
			 */
			Compose(panels: Collections.Enumerable<ComposedPanelViewportState>, initialOrdering: boolean): Collections.Enumerable<ComposedPanelViewportStateChange>;
        }

		/**
		 * Exception thrown when the Orientation of the viewport cant be changed.
		 */
		class ViewportOrientationChangeException extends RuntimeException { }

        export interface ICompositeViewportManager extends IViewportManager {
			/**
			 * Arrange this viewport using the given Composer.
			 * @param comp Composer to use.
			 * @constructor
			 */
            Compose(comp: IViewportComposition): void;

			/**
			 * Get the last used composition.
			 */
			CurrentComposition: IViewportComposition;
        }

		/**
		 * Internal position object. Do not expose.
		 */
		interface ViewportPanelPosition {
			accumOffset: number; // Percentage offset from left or top side.
			size: number; // Percentage size
			hash: number; // Panel HashCode
		}

		/**
		 * Default ICompositeViewportManager implementation.
		 *
		 * Uses any jQuery animation to animate and tile the viewport panels next to each other in any orientation.
		 */
		export class CompositeViewportManager implements ICompositeViewportManager {
			public static ViewportClassHorizontal = 'tiling-viewport-horizontal';
			public static ViewportClassVertical = 'tiling-viewport-vertical';

			/**
			 * Get the last used Composition.
			 * @returns IViewportComposition
			 * @constructor
			 */
			public get CurrentComposition(): IViewportComposition { return this.Composition; }

			/**
			 * Animation duration of the selected easing function for composition animations.
			 */
			public AnimationDuration = 300;

			/**
			 * Any jQuery supported easing function.
			 */
			public AnimationEasing = 'linear';

			/**
			 * Th default animation direction, if it is not set by the composer.
			 */
			public AnimationDefaultDirection: Side = Side.Top;

			/**
			 * PanelGroup main element: the viewport assigned to this manager.
			 */
			private Element: JQuery;

			/**
			 * Panels that are known to the viewport manager.
			 */
			private Panels: Collections.List<ComposedPanelViewportState>;

			/**
			 * Currently applied composition.
			 */
			private Composition: IViewportComposition;

			/**
			 * Ordered list of the current positions of every panel in view.
			 */
			private Positions: Collections.List<ViewportPanelPosition>;

			/**
			 * Whether or not this is the first arrangement/composition call.
			 */
			private IsInitialComposition: boolean = true;

			/**
			 * Viewport recieves PanelGroup element that represents the viewport.
			 */
			constructor(initialComposition: IViewportComposition = null, public ViewportOrientation: Orientation = Orientation.Horizontal, public AnimateInitialState: boolean = false) {
				if(initialComposition == null)
					new Composition.TilingViewportComposition();
				else if(initialComposition.Compose && initialComposition.Orientation)
					this.Composition = initialComposition;
				else throw new RuntimeException('Invalid initialComposition parameter! Expected an IViewportComposition implemnetation but it does not have it\'s methods.');
			}

			/**
			 * Arrange this viewport using the given Composer.
			 * @param comp Composer to use. (Optional; uses TilingViewportComposition as a default)
			 */
			public Compose(comp:Panels.Viewport.IViewportComposition = null): void {
				if(!this.AnimateInitialState && this.IsInitialComposition) {
					this.ArrangeInitial(comp.Compose(this.Panels, true));
				}else{
					this.Arrange(comp.Compose(this.Panels, false));
				}
				this.IsInitialComposition = false;
			}

			/**
			 * Set the viewport root element.
			 * @param viewportElement The inner element of the PanelGroup.
			 */
			public SetElement(viewportElement: JQuery): void {
				var cssClass = this.ViewportOrientation == Orientation.Horizontal ? CompositeViewportManager.ViewportClassHorizontal : CompositeViewportManager.ViewportClassVertical;
				if(this.Element != null)
					this.Element.removeClass(cssClass);
				this.Element = viewportElement;
				this.Element.addClass(cssClass);
			}

			/**
			 * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
			 * @param ref
			 */
			public Attach(ref: Panels.PanelReference): void {
				this.Element.append(ref.OuterElement.hide());
			}

			/**
			 * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
			 * @param ref
			 */
			public Detach(ref: Panels.PanelReference): void {
				ref.OuterElement.show().detach();
			}

			/**
			 * Check whether this Viewportmanager manages/knows this panel.
			 * @param ref
			 */
			public IsAttached(ref: Panels.PanelReference): boolean {
				return ref.OuterElement.parent().attr('id') == this.Element.attr('id');
			}

			/**
			 * Arranges the panels in the Viewport in the given manner.
			 * @param arrangement Accepts PanelViewportStateChange for interface compatibility but prefers ComposedPanelViewportStateChange objects, which also include a size modifier.
			 */
			public Arrange(arrangement: Collections.Enumerable<Panels.Viewport.PanelViewportStateChange>): void {
				// @todo Animate out any panels that are currently in the viewport, but are not listed in the viewport state change descriptor

				// The rest is not necessary to execute when there are no changing panels.
				if(arrangement.CountAll() == 0)
					return;

				// First hide all the panels that are gone (e.g. currently visible, but in the new arrangement are gone)
				arrangement
					.Where(x => x.PreviousVisibility == true && x.Visibility == false)
					.Each((stateChange) => {
						// Animate them out in the desired direction
						var animationProps = {
							duration: this.AnimationDuration,
							easing: this.AnimationEasing,
							complete: () => stateChange.Reference.OuterElement.hide()
						};
						switch(stateChange.AnimationDirection === null ? this.AnimationDefaultDirection : stateChange.AnimationDirection){
							case Side.Top:
								stateChange.Reference.OuterElement.animate({
									top: '-100%'
								}, animationProps);
								break;
							case Side.Down:
								stateChange.Reference.OuterElement.animate({
									top: '100%'
								}, animationProps);
								break;
							case Side.Left:
								stateChange.Reference.OuterElement.animate({
									left: '-100%'
								}, animationProps);
								break;
							case Side.Right:
								stateChange.Reference.OuterElement.animate({
									left: '100%'
								}, animationProps);
								break;
						}
					});

				// Calculate sizes
				var updatedPosition = new Collections.List<ViewportPanelPosition>();
				var totalPanels = arrangement.Where(x => x.Visibility == true).CountAll();
				var totalOffset = 0;
				var totalCustomPanelSize = 0; // Total accumulated size of all panels with a custom set size attribute
				var totalNumberOfCustomSizedPanel = 0; // Total number of panels with a custom set size attribute
				arrangement
					.Where(x => x.Visibility == true)
					.OrderBy(x => x.Position)
					.Each(stateChange => {
						var size = (1.00 / totalPanels);
						var customSize = (<Panels.Viewport.ComposedPanelViewportStateChange> stateChange).Size;
						if(customSize != null && customSize <= 1.00 && customSize > 0){
							totalNumberOfCustomSizedPanel++;
							totalCustomPanelSize += customSize;
							size = customSize;
						}
						if(customSize != null && customSize > 1.00 && customSize < 0)
							console.warn('Invalid size found for panel with hashcode "'+stateChange.Reference.GetHashCode()+'": size of "'+customSize+' is invalid. It has to be a number between 1.00 and 0.00 (that in combination with the other /visible/ panels preferably adds up to 1.00).');
						if(totalCustomPanelSize > 1.00)
							throw new Error('Total size of visible panels exceeds the available space.');
						updatedPosition.Add({
							size: size,
							hash: stateChange.Reference.GetHashCode(),
							accumOffset: totalOffset
						});
						totalOffset += size;
					});
				if(totalOffset > 1.00){
					// Recalculate the arrangement
					updatedPosition = new Collections.List<ViewportPanelPosition>();
					totalOffset = 0;
					arrangement
						.Where(x => x.Visibility == true)
						.OrderBy(x => x.Position)
						.Each(stateChange => {
							var customSize = (<Panels.Viewport.ComposedPanelViewportStateChange> stateChange).Size;
							if(totalCustomPanelSize >= 1 && customSize == null) // we dont need no division by zero errors
								return;
							var size = ((1.00 - totalCustomPanelSize) / (totalPanels - totalNumberOfCustomSizedPanel));
							if(customSize != null && customSize <= 1.00 && customSize > 0)
								size = customSize;
							updatedPosition.Add({
								size: size,
								hash: stateChange.Reference.GetHashCode(),
								accumOffset: totalOffset
							});
							totalOffset += size;
						});
				}

				// Resize and move all the panels that are in the previous and current state
				arrangement
					.Where(x => x.PreviousVisibility == x.Visibility && x.Visibility == true && x.PreviousPosition != x.Position)
					.Each(stateChange => {

					});

				// Animate in all the panels that are new.
				arrangement
					.Where(x => x.PreviousVisibility == x.Visibility && x.Visibility == true)
					.Each(stateChange => {

					});
			}

			/**
			 * Arrange the given panels in the viewport for the initial panel setup.
			 * @param arrangement The panels and their position and visibility in the viewport.
			 */
			public ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void {

			}
		}
    }
}