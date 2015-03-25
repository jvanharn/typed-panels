module Panels {
    export module Viewport {
        /**
         * Viewport Manager that tiles the panels horizontally OR vertically.
         * Has animations.
         */
        export class TilingViewportManager implements IViewportManager {
            public static ViewportClassHorizontal = 'tiling-viewport-horizontal';
            public static ViewportClassVertical = 'tiling-viewport-vertical';
            public Element: JQuery;
            public AnimationDuration = 300;
            public AnimationEasing = 'linear';
            
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            constructor(public ViewportOrientation: Orientation = Orientation.Horizontal, public AnimateInitialState: boolean = false) { }
            
            /**
             * Viewport recieves PanelGroup element that represents the viewport.
             */
            public SetElement(viewportElement: JQuery): void {
                var cssClass = this.ViewportOrientation == Orientation.Horizontal ? TilingViewportManager.ViewportClassHorizontal : TilingViewportManager.ViewportClassVertical;
                if(this.Element != null)
                    this.Element.removeClass(cssClass);
                this.Element = viewportElement;
                this.Element.addClass(cssClass);
            }
            
            /**
             * Attach a Panel to the Viewportmanager (Does nothing else, just makes it known that it exists, makes it possible for the viewportmanager to move the panel element into the viewport and hide it.)
             */
            public Attach(ref: Panels.PanelReference): void {
                this.Element.append(ref.OuterElement.hide());
            }
            
            /**
             * Detach a Panel from the ViewportManager, making sure that it is restored in it's default state (Display value etc.)
             */
            public Detach(ref: Panels.PanelReference): void {
                ref.OuterElement.show().detach();
            }
            
            /**
             * Check whether this Viewportmanager manages/knows this panel.
             */
            public IsAttached(ref: Panels.PanelReference): boolean {
                return ref.OuterElement.parent().attr('id') == this.Element.attr('id');
            }
            
            /**
             * Arrange the given panels in the viewport according to the given orientation.
             */
            public Arrange(arrangement: Collections.Enumerable<PanelViewportStateChange>, initial: boolean = false): void {
				// Check the number of visible panels.
				var visibleBefore = arrangement.CountAll(x => x.PreviousVisibility == true);
				var visibleAfter = arrangement.CountAll(x => x.Visibility == true);

				var firstVisible = arrangement.First(x => x.Visibility == true);
				var lastVisible = arrangement.Last(x => x.Visibility == true);

				// Apply the correct offsets and widths to all panels.
				arrangement.Each(ref => {
					// Calculate prev position
					var prevWidth = 100 / visibleBefore; // perc. width
					var prevOffset = prevWidth * ref.PreviousPosition; // perc. offset

					// Calculate new position
					var width = 100 / visibleAfter;
					var offset = width * ref.Position;

					if (ref.Changed || visibleBefore != visibleAfter) {
						if (ref.PreviousVisibility != ref.Visibility) {
							if (ref.Visibility == true) { // Flick in from top
								ref.Reference.OuterElement.css({
									left: offset + '%',
									top: '-100%',
									width: width + '%'
								}).show();
								ref.Reference.OuterElement.animate({
									top: '0%'
								}, {
									duration: this.AnimationDuration,
									easing: this.AnimationEasing
								});
							} else { // Flick it out towards bottom
								ref.Reference.OuterElement.animate({
									top: '100%'
								}, {
									complete: function () {
										ref.Reference.OuterElement.hide();
									},
									duration: this.AnimationDuration,
									easing: this.AnimationEasing
								});
							}
						} else {// Just a position change
							if (ref.Visibility == true) {
								// Animate
								ref.Reference.OuterElement.css({
									left: prevOffset + '%',
									width: prevWidth + '%'
								}).animate({
									left: offset + '%',
									width: width + '%'
								}, {
									duration: this.AnimationDuration,
									easing: this.AnimationEasing
								});
							} else {
								// edge case
								ref.Reference.OuterElement.hide();

							}
						}
					}
				});
            }

			/**
			 * Arrange the given panels in the viewport for the initial panel setup.
			 * @param arrangement The panels and their position and visibility in the viewport.
			 */
			public ArrangeInitial(arrangement: Collections.Enumerable<PanelViewportState>): void {
				// Check the number of visible panels.
				var visible = arrangement.CountAll(x => x.Visibility == true);

				// Apply the correct offsets and widths to all panels.
				arrangement.Each(ref => {
					// Calculate initial position
					var width = 100 / visible;
					var offset = width * ref.Position;

					if(this.AnimateInitialState && ref.Visibility == true){
						ref.Reference.OuterElement.css({
							left: offset+'%',
							top: '-100%',
							width: width+'%'
						}).show();
						ref.Reference.OuterElement.animate({
							top: '0%'
						}, {
							duration: this.AnimationDuration,
							easing: this.AnimationEasing
						});
					} else if(ref.Visibility == true) {// Just a position change
						// Animate
						ref.Reference.OuterElement.css({
							left: offset+'%',
							width: width+'%'
						}).show();
					}else{
						// edge case
						ref.Reference.OuterElement.hide();
					}
				});
			}
        }
    }
}