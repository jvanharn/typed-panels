module Panels {
    export module Groups {
        /**
         * The simplest of all PanelGroups. Shows only one Panel at all times, hides the rest. (No animation)
         */
        export class TabbedPanelGroup extends StackingPanelGroup implements ILiftablePanelGroup {
            /**
             * The UL element containing all the tabs.
             */
            private TabsListElement: JQuery;
            
            public constructor(){
                super();
                this.TabsListElement = jQuery('<ul>');
                this.PanelElement.append(this.TabsListElement);
				this.ContentElement = jQuery('<div>');
				this.PanelElement.append(this.ContentElement);
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
    		
			public DetachPanel(name: string): IPanel {
				var panel = this.GetPanel(panel);
				this.TabsListElement.find("li[data-panelid="+ panel.PanelSeqId +"]").remove();
				return super.DetachPanel(name);
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
            
			public ShowTabs(): void {
				this.TabsListElement.show();
			}
			
			public HideTabs(): void {
				this.TabsListElement.hide();
			}
			
            /**
             * Render all the sub panels.
             */
            public Render(): void {
                _.each(this.Panels, function(panel){
					panel.Render();
				});
            }
			
			public FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void {
				if(_.size(this.Panels) > 0)
					throw new RuntimeException('Tried to fill this group after panels were already added manually. This group does not support that.');
				
				var contentElement = Panels.LiftablePanelHelper.FindElementWithRole(panelElement, 'content');
				if(contentElement.length == 0)
					contentElement = jQuery('<div>');
				
                Panels.LiftablePanelHelper.ReplacePanelElements(this, panelElement, contentElement);
				
				this.TabsListElement = panelElement.find('ul');
				if(this.TabsListElement.length == 0){
					console.log('No tab list found for lifting panel from DOM, proceeded to make a tablist ourselves.');
					
					this.TabsListElement = jQuery('<ul>');
					this.PanelElement.prepend(this.TabsListElement);
					
					for(var i=0; i<panels.length; i++){
						this.AddPanel(panels[i].Panel);
					}
				}else{
					// existing tabs
					_.each(panels, (pnl) => {
						var panel = pnl.Panel;
						
						super.AddPanel(panel);
						
						var tab = this.TabsListElement.find('li[data-panelid='+panel.PanelSeqId+']');
						if(tab.length == 0){
							tab = this.TabsListElement.find('li[data-show-panel='+panel.PanelName+']');
							if(tab.length == 0){
								console.error('No tab found for panel with name "'+panel.PanelName+'"!!');
								return;
							}else{
								tab.attr('data-panelid', panel.PanelSeqId);
							}
						}
						tab.click(e => this.Show(panel.PanelName));
					});
				}
            }
        }
    }
}