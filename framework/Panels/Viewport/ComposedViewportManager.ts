/// <reference path="../../../defs/jquery.d.ts" />
module Panels {
    export module Viewport {
        export interface IViewportComposition {
            
        }
        
        export interface ICompositeViewportManager extends IViewportManager {
            Compose(comp: IViewportComposition): void;
        }
    }
}