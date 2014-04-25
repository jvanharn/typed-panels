/// <reference path="../LiftablePanel.ts" />

module Panels {
    export module Groups {
        /**
         * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
         */
        export class StackingPanelGroup extends PanelGroup implements ILiftablePanelGroup {
            public Show(panelId: string): void {
                _.each(this.Panels, (val, key) => {
                    if(key == panelId)
                        val.PanelElement.show();
                    else val.PanelElement.hide();
                });
            }
            
            public Hide(panelId: string): void{
                _.each(this.Panels, (val, key) => {
                    if(key == panelId)
                        val.PanelElement.hide();
                });
            }
            
            public Render(): void { }
            
            public FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void {
                Panels.LiftablePanelHelper.ReplacePanelElements(this, panelElement);
                for(var i=0; i<panels.length; i++){
                    this.AddPanel(panels[i].Panel);
                }
            }
        }
    }
}