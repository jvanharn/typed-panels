module Panels {
    export module Groups {
        /**
         * Panel group that supports compositing 
         */
        export class ComposablePanelGroup<TViewportManager extends Panels.Viewport.ICompositeViewportManager> extends ManagedPanelGroup<TViewportManager, ComposablePanelGroup<TViewportManager>> {


			public Compose(composition: Panels.Viewport.IViewportComposition): void {
                
            }
        }
    }
}