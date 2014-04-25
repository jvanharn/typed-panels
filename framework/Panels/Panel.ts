/// <reference path="../../defs/jquery.d.ts" />
/// <reference path="../../defs/lodash.d.ts" />
/// <reference path="../TemplateFactory.ts" />
module Panels {
    /**
     * Makes the element accessors of a panel visible in intellisense.
     * Cast an panel to this interface to be able to access those elements.
     * Example: (<Panels.ProtectedPanel> <any> this)._panelElement
     * Example 2: this.Cast<ProtectedPanel>()._panelElement
     * @access private
     */
    export interface ProtectedPanel {
        _panelElement: JQuery;
		_contentElement: JQuery;
    }
    
    export interface IPanel {
        PanelName: string;
        PanelSeqId: number;
        PanelElement: JQuery;
        ContentElement: JQuery;
        Render(): void;
    }
    
    /**
     * Panel Object
     * 
     * Represents a subset of an application interface.
     * @abstract
     */
	export class Panel extends BaseObject implements IPanel {
	    /**
	     * Counts the number of panels currently instantiated.
	     */
		private static _panelCnt: number = 0;
		
		/**
		 * The sequential/internal identifier of this panel.
		 */
	    private _panelId: number = -1;
	    
	    /**
	     * The (Given) name of this panel.
	     */
	    private _panelName: string = null;
	    
	    /**
	     * The panels outermost element.
	     */
	    private _panelElement: JQuery;
	    
	    /**
	     * The innermost element of the panel. (For example: when the panel provides scrolbars this will be the the elment that is scrollable.)
	     */
		private _contentElement: JQuery;
		
		/**
		 * Get the name of the panel.
		 */
	    get PanelName(): string { return this._panelName ? this._panelName : 'panel' + this._panelId; }
	    
	    /**
	     * Set the name of this panel.
	     * WARNING: Do not change the name of a panel AFTER it ha been added to a group!!
	     */
	    set PanelName(name: string) { this._panelName = name; this.PanelElement.attr('id', name); }
	    
	    /**
	     * Get the unique identifier of this panel. (Unmodifyable)
	     */
	    get PanelSeqId(): number { return this._panelId; }
	    
	    /**
	     * Get the panel's outermost element.
	     * 
	     * Use this element to move the entire Panel through the DOM.
	     */
	    get PanelElement(): JQuery {
	        return this._panelElement;
	    }
	    
	    /**
	     * Get the panle's innermost element.
	     * 
	     * Use this element to add/alter/remove content inside the Panel.
	     */
	    get ContentElement(): JQuery {
	        return this._contentElement;
	    }
	    
	    /**
	     * @abstract
	     */
		public constructor() {
		    super();
		    this._panelId = Panel._panelCnt++;
			this._panelElement = jQuery('<div class="view-panel" id="'+this.PanelName+'">');
			this._contentElement = this._panelElement;
		}
		
		/**
		 * Render the panel so it will be displayed.
		 */
		public Render(): void {
			this.Renderer();
		}
		
		/**
		 * This is the method the panel implementation will overwrite.
		 * Please do not directly call this method unless you know what you are doing.
		 * @abstract
		 * @access protected
		 */
		Renderer(): void {
		    throw new AbstractMethodException();
		}
		
		/**
		 * Asynchronusly retrieve an template to work with.
		 */
		public withTemplate(name: string, callback: (tpl: _.TemplateExecutor) => void): void {
			TemplateFactory.WithTemplate(name, callback.bind(this));
		}
		
		/**
		 * Synchronously retrieve an compiled template.
		 */
		public GetTemplate(name: string): _.TemplateExecutor{
			return TemplateFactory.GetTemplate(name);
		}
	}
}