/// <reference path="ConsumablePanel.ts" />
module Panels {
	export class DynamicPanel extends ConsumablePanel {
		constructor(private RendererCallback: (contentElement: JQuery, panelElement: JQuery, context: DynamicPanel) => void) {
		    super();
		}
		public Render(): void {
			this.RendererCallback(this.ContentElement, this.PanelElement, this);
		}
	}
}