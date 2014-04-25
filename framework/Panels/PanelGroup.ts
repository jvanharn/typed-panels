/// <reference path="panel.ts" />
module Panels {
    export interface IPanelGroup extends IPanel {
        /**
		 * Add an panel to the group.
		 */
		AddPanel(panel: IPanel): void;
		
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
	    HasPanelByReference(ref: Panels.PanelReference): boolean;
	    
	    ShowByReference(ref: Panels.PanelReference): void;
	    
	    HideByReference(ref: Panels.PanelReference): void;
	    
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
}

class UnknownPanelException extends KeyNotFoundException {
    public name = 'UnknownPanelException';
    public message = 'The given panel is not registred with this group or by that name.';
}