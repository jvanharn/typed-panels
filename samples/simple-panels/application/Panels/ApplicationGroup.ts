class ApplicationGroup extends Panels.Groups.StackingPanelGroup {
	private FirstGreetingPanel: GreetingPanel;
	private SecondGreetingPanel: GreetingPanel;
	
    public constructor(){
        super();
        
		var firstModel = new SimpleViewModel();
		firstModel.Greeting = 'first tab.';
		// The boolean sets whether the panel should rerender when the model changes,
		// ..the second argument sets the model that will set the greeting for our panel.
		this.FirstGreetingPanel = new GreetingPanel(true, firstModel);
		this.FirstGreetingPanel.PanelName = 'firstpanel';
		this.AddPanel(this.FirstGreetingPanel);
		
		var secondModel = new SimpleViewModel();
		secondModel.Greeting = 'second tab =D';
		this.SecondGreetingPanel = new GreetingPanel(true, secondModel);
		this.SecondGreetingPanel.PanelName = 'secondpanel';
		this.AddPanel(this.SecondGreetingPanel);
		
		this.FirstGreetingPanel.Render();
		this.SecondGreetingPanel.Render();
		
		this.Show(this.FirstGreetingPanel.PanelName);
    }
	
	public SwitchPanel(panel: string): void {
		switch(panel){
			case 'firstpanel':
				$('#firstlist-selector').addClass('active');
				$('#secondlist-selector').removeClass('active');
				break;
			case 'secondpanel':
				$('#firstlist-selector').removeClass('active');
				$('#secondlist-selector').addClass('active');
				break;
		}
		this.Show(panel);
	}
}