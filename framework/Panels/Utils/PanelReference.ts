/// <reference path="../../EqualityComparer.ts" />

module Panels {
    /**
     * This is used as a type to establish the identity of an individual panel within the system, so that the system always knows what panel everyone is talking aout.
     * Can also be read as PanelReference
     */
    export class PanelReference extends BaseObject implements IEqualityComparable<PanelReference> {
        public constructor(private _panel: IPanel, private _group: IViewportPanelGroup){
            super();
            // @todo use event system to listen to panel destruction.
        }
        
        /**
         * Get the css id
         */
        get PanelName(): string {
            return this._panel.PanelName;
        }
        
        /**
         * Get an unique query string that will point you to the PANEL element
         */
        get QueryString(): string {
            return '#' + this.PanelName;
        }
        
        /**
         * Get the panel element wrapped in an jQuery object
         */
        get OuterElement(): JQuery {
            return this._panel.PanelElement;
        }
        
        /**
         * Get the innermost element (Will be same element as the outermost element for most elements, will be different for crollable panels etc.)
         */
        get InnerElement(): JQuery {
            return this._panel.ContentElement;
        }
        
        /**
         * Get whether or not the panel is currently shown in the viewport.
         */
        get Visibility(): boolean {
            return this._group.IsVisible(this.PanelName);
        }
        
        /**
         * Set the visibility of the element inside the viewport.
         */
        set Visibility(show: boolean) {
            if(show)
                this._group.Show(this.PanelName);
            else
                this._group.Hide(this.PanelName);
        }
        
        /**
         * Get the group this panel is in.
         */
        get Group(): IViewportPanelGroup {
            return this._group;
        }
        
        /**
         * Get the panel this object references to.
         */
        get Panel(): IPanel {
            return this._panel;
        }
        
        /**
         * Replacement for the toString builtin.
         */
        public toString(): string {
            return this.PanelName;
        }
        
        // #section IEqualityComparable Implementation
        /**
         * Checks whether two references are refering to the same object.
         */
        public Equals(obj: PanelReference): boolean {
            if(obj === undefined)
                throw new NullReferenceException();
            return obj.PanelName == this.PanelName;
        }
        
        /**
         * Get an unique hashcode for the referenced panel.
         */
        public GetHashCode(): number {
            return this._panel.PanelSeqId;
        }
        // #endsection
    }    
}