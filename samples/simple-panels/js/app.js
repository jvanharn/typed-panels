var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Simple viewmodel
var SimpleViewModel = (function (_super) {
    __extends(SimpleViewModel, _super);
    function SimpleViewModel(options) {
        if (typeof options === "undefined") { options = {}; }
        _super.call(this, null, options);
        this.id = null;
        this.Greeting = null;
        this.RefreshModelProperties();
    }
    return SimpleViewModel;
})(Model.ViewModel);
var ApplicationGroup = (function (_super) {
    __extends(ApplicationGroup, _super);
    function ApplicationGroup() {
        _super.call(this);

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
    ApplicationGroup.prototype.SwitchPanel = function (panel) {
        switch (panel) {
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
    };
    return ApplicationGroup;
})(Panels.Groups.StackingPanelGroup);
var GreetingPanel = (function (_super) {
    __extends(GreetingPanel, _super);
    function GreetingPanel() {
        _super.apply(this, arguments);
    }
    GreetingPanel.prototype.Render = function () {
        return this.RenderModel('greetingview');
    };
    return GreetingPanel;
})(Panels.ModelPanel);
/// <reference path="../../../defs/jquery.d.ts" />
/// <reference path="../../../defs/lodash.d.ts" />
/// <reference path="../../../dist/typed.d.ts" />
// Models
/// <reference path="Models/SimpleViewModel.ts" />
// Panels
/// <reference path="Panels/ApplicationGroup.ts" />
/// <reference path="Panels/GreetingPanel.ts" />
var Application = (function (_super) {
    __extends(Application, _super);
    function Application(_container) {
        var _this = this;
        _super.call(this);
        this._container = _container;

        this.MainGroup = new ApplicationGroup();
        this._container.append(this.MainGroup.PanelElement);
        this.MainGroup.Render();

        $('#firstlist-selector').click(function () {
            _this.MainGroup.SwitchPanel('firstpanel');
        });
        $('#secondlist-selector').click(function () {
            _this.MainGroup.SwitchPanel('secondpanel');
        });
    }
    Object.defineProperty(Application, "Instance", {
        get: function () {
            if (Application._instance == null)
                Application._instance = new Application($('#am-container'));
            return Application._instance;
        },
        enumerable: true,
        configurable: true
    });
    Application._instance = null;
    return Application;
})(BaseObject);

// Initialize/Bootstrap application
TemplateFactory.ViewBasePath = 'application/Views/';
$(document).ready(function () {
    // This is the beginning point for the application, here it gets rendered in the #am-container element when the dom is ready.
    // I have placed it in this variable so you can see what's happening underneath the hood.
    window.AppDebug = new Application($('#app-container'));
});
