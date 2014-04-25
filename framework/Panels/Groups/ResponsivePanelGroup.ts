/// <reference path="ManagedPanelGroup.ts" />

module Panels {
    export module Groups {
        export class ResponsivePanelGroup<TViewportManager extends Panels.Viewport.IViewportManager> extends ManagedPanelGroup<TViewportManager, ResponsivePanelGroup<TViewportManager>> {
            
            /**
             * Create a ResponsivePanelGroup and auto create a viewportmanager for it of your choice with the given arguments.
             */
            public static CreateWithViewport<TViewportType extends Panels.Viewport.IViewportManager>(viewportType: any, ...viewportArgs): ResponsivePanelGroup<TViewportType> {
                return new ResponsivePanelGroup<TViewportType>(new (Function.prototype.bind.apply(viewportType, arguments)));
            }
        }
    }
}