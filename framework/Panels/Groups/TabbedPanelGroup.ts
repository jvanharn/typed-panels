module Panels {
    export module Groups {
        /**
         * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
         */
        export class TabbedPanelGroup extends StackingPanelGroup {
            /**
             * The UL element containing all the tabs.
             */
            private TabsListElement: JQuery;
            
            public constructor(){
                super();
                this.TabsListElement = jQuery("<ul>");
                this.PanelElement.prepend(this.TabsListElement);
            }
            
            /**
    		 * Add an panel to the group.
    		 */
    		public AddPanel(panel: IPanel): void {
    		    this.AddTab(panel, panel.PanelName);
    		}
    		
    		public AddTab(panel: IPanel, label: string): void {
    		    super.AddPanel(panel);
    		    this.TabsListElement.append(
    		        jQuery("<li data-panelid=\""+ panel.PanelSeqId +"\">"+ panel.PanelName +"</li>")
    		            .click(e => this.Show(panel.PanelName)));
    		}
    		
    		public SetLabel(panelName: string, label: string): void {
    		    this.FindTabByName(panelName).text(label);
    		}
    		
    		public Show(name: string): void {
    		    super.Show(name);
    		    this.TabsListElement.find("li.active").removeClass("active");
    		    this.FindTabByName(name).addClass("active");
    		}
    		
    		private FindTabByName(name:string): JQuery {
    		    return this.TabsListElement.find("li[data-panelid="+this.Panels[name].PanelSeqId+"]");
    		}
            
            /**
             * 
             */
            public Render(): void {
                // render tabs
                
            }
        }
    }
}