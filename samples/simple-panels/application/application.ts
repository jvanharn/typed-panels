/// <reference path="../../../defs/jquery.d.ts" />
/// <reference path="../../../defs/lodash.d.ts" />
/// <reference path="../../../dist/typed.d.ts" />

// Models
/// <reference path="Models/SimpleViewModel.ts" />

// Panels
/// <reference path="Panels/ApplicationGroup.ts" />
/// <reference path="Panels/GreetingPanel.ts" />

class Application extends BaseObject {
    private static _instance: Application = null;
    static get Instance(): Application {
        if(Application._instance == null)
            Application._instance = new Application($('#am-container'));
        return Application._instance;
    }
    
	public MainGroup: ApplicationGroup;

    public constructor(private _container: JQuery){
        super();
		
		this.MainGroup = new ApplicationGroup();
		this._container.append(this.MainGroup.PanelElement);
		this.MainGroup.Render();
		
		$('#firstlist-selector').click(() => {
			this.MainGroup.SwitchPanel('firstpanel');
		});
		$('#secondlist-selector').click(() => {
			this.MainGroup.SwitchPanel('secondpanel');
		});
    }
}

// Initialize/Bootstrap application
TemplateFactory.ViewBasePath = 'application/Views/';
$(document).ready(function(){
	// This is the beginning point for the application, here it gets rendered in the #am-container element when the dom is ready.
	// I have placed it in this variable so you can see what's happening underneath the hood.
	(<any> window).AppDebug = new Application($('#app-container'));
});