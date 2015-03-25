/// <reference path="Panel.ts" />
/// <reference path="Utils/PanelReference.ts" />

module Panels {
    export interface IPanelGroup extends IPanel {
        /**
		 * Add an panel to the group.
		 */
		AddPanel(panel: IPanel): void;
		
		/**
		 * Detach a panel by it's name and get the panel object.
		 */
		DetachPanel(name: string): IPanel;
		
		/**
		 * Get a panel from the group by it's name.
		 */
		GetPanel(name: string): IPanel;
		
		/**
		 * Get a Panel of the specified type by the specified name.
		 */
		GetTypedPanel<TPanel extends IPanel>(name: string): TPanel;
		
		/**
		 * Get all panels of the given type.
		 */
		GetPanelsByType(type: any): IPanel[];
		
		/**
		 * Check if the group has a panel with the specified name.
		 */
		HasPanel(name: string): boolean;
    }
    
    export interface IViewportPanelGroup extends IPanelGroup {
        /**
         * Show a Panel by it's name.
         */
	    Show(name: string): void;
	    
	    /**
	     * Hide a panel by it's name.
	     */
        Hide(name: string): void;
        
        /**
         * Check if the given named panel is visible in the group viewport.
         */
        IsVisible(name: string): boolean;
	}
	
	export interface IReferencedViewportPanelGroup extends IViewportPanelGroup {
		/**
		 * Detach a panel from this group.
		 */
	    DetachPanelByReference(ref: Panels.PanelReference): IPanel;
		
		/**
		 * Check if the panel with the given name is registered with this group.
		 */
	    HasPanelByReference(ref: Panels.PanelReference): boolean;
	    
		/**
		 * Show a panel by its reference object.
		 */
	    ShowByReference(ref: Panels.PanelReference): void;
	    
		/**
		 * Hide a panel by its reference.
		 */
	    HideByReference(ref: Panels.PanelReference): void;
	    
		/**
		 * Check if a panel in this group is currently in the viewport.
		 */
	    IsVisibleByReference(ref: Panels.PanelReference): boolean;
	}
    
	export class PanelGroup extends Panel implements IPanelGroup {
		Panels: { [name: string]: IPanel; } = {};
		
		/*get ContentElement(): JQuery {
		    throw new MethodNotAccessibleException();
		}*/
		
		constructor() {
			super();
			this.PanelElement.addClass('view-panel-group');
		}
		
		/**
		 * Add an panel to the group.
		 */
		public AddPanel(panel: IPanel): void {
			this.Panels[panel.PanelName] = panel;
			this.ContentElement.append(panel.PanelElement);
		}
		
		/**
		 * Detach the panel with the given name.
		 */
		public DetachPanel(name: string): IPanel {
			if(this.Panels[name] === undefined)
		        throw new UnknownPanelException();
			this.Panels[name].PanelElement.detach();
			var pn = this.Panels[name];
			delete this.Panels[name];
			return pn;
		}
		
		/**
		 * Get a panel from the group by it's name.
		 */
		public GetPanel(name: string): IPanel {
		    if(this.Panels[name] === undefined)
		        throw new UnknownPanelException();
			return this.Panels[name];
		}
		
		/**
		 * Get a Panel of the specified type by the specified name.
		 */
		public GetTypedPanel<TPanel extends IPanel>(name: string): TPanel {
			return <TPanel> <any> this.GetPanel(name);
		}
		
		/**
		 * Get all panels of the given type.
		 */
		public GetPanelsByType(type: any): IPanel[]{
			var result: Panel[] = [];
			for(var pnl in this.Panels){
				if(pnl instanceof type)
					result[result.length] = pnl;
			}
			return result;
		}
		
		/**
		 * Check if the group has a panel with the specified name.
		 */
		public HasPanel(name: string): boolean {
		    return (this.Panels[name] !== undefined);
		}
	}
	
	export class PanelGroupHelper {
		/**
		 * Check whether the given panel is not attached to another group.
		 */
		public static IsPanelAttachable(panel: IPanel): boolean{
			return (panel.PanelElement.parent().length == 0);
		}
	}
}

class UnknownPanelException extends KeyNotFoundException {
    public name = 'UnknownPanelException';
    public message = 'The given panel is not registered with this group or by that name.';
}