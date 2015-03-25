/// <reference path="../../defs/jquery.d.ts" />
/// <reference path="../Exceptions.ts" />
/// <reference path="Groups/StackingPanelGroup.ts" />
/// <reference path="panel.ts" />
/// <reference path="panelgroup.ts" />

module Panels {
    export interface ILiftablePanel extends IPanel {
        FillFromElement(panelElement: JQuery, contentElement?: JQuery): void;
    }
    
    export interface ILiftablePanelGroup extends IPanelGroup {
        /**
         * Fills the group with the given DOM data.
         * (Can/should only be called once directly after the constructor, should be disabled afterwards, unless this is unnecesserry)
         */
        FillFromElement(panelElement: JQuery, panels: ILiftedPanelData[]): void;
    }
    
    export interface ILiftedPanelData {
        Panel: IPanel;
        GroupConfig: any;
    }
    
    /**
     * Simplest type of Panel that can be constructed from DOM.
     * Does absolutely nothing but serve as a facade to work with in the framework.
     */
    export class LiftedPanel extends Panel implements ILiftablePanel {
        public constructor(panelElement?: JQuery, contentElement?: JQuery){
            super();
            LiftablePanelHelper.ReplacePanelElements(this, panelElement, contentElement);
        }
        
        public Renderer(): void { }
        
        public FillFromElement(panelElement: JQuery, contentElement?: JQuery): void {
            LiftablePanelHelper.ReplacePanelElements(this, panelElement, contentElement);
        }
    }
    
    export enum LiftableElementState {
        NotLiftable,
        Panel,
        Group
    }
    
    export class LiftablePanelHelper {
        /**
         * Data attribute that contains information about the role of the element.
         */
        public static DataElementRole = "data-element-role";
        
        /**
         * Data attribute that contains the type of group this element should be lifted as.
         */
        public static DataPanelType = "data-panel-type";
        
        /**
         * Data attribute that describes the panel type to initialize the group as.
         */
        public static DataGroupType = "data-group-type";
        
        /**
         * The configuration for the panel or group itself when on a panel or group. (Constructor Params)
         * Should contain a JSON Array with constructor arguments.
         */
        public static DataPanelConfig = "data-panel-config";
        
        /**
         * The configuration for the parent group when on a group or panel type. (AddPanel Params)
         * Should contain a JSON object.
         */
        public static DataGroupConfig = "data-group-config";
        
        /**
         * Overridable default panel constructor. (When no type is set.)
         */
        public static DefaultPanelConstructor: (panelElement: JQuery, contentElement: JQuery, panelConfig: any) => IPanel
			= (panelElement, contentElement, panelConfig) => new LiftedPanel(panelElement, contentElement);
        
        /**
         * Overridable default panelgroup constructor.
         */
        public static DefaultPanelGroupConstructor: (panelElement: JQuery, contentElement: JQuery, panelConfig: any, panels: ILiftedPanelData[]) => IPanelGroup =
            (groupElement, contentElement, panels) => {
                var group = new Panels.Groups.StackingPanelGroup();
                group.FillFromElement(groupElement, panels);
                return group;
            }
        
        /**
         * Lifts a panel from an element. (Only a single panel is supported, the first found panel element is detached from the element, the rest is ignored.)
         */
        public static LiftPanelFromElement(element: JQuery): ILiftedPanelData {
			if(!element.length || element.length > 1)
				throw new InvalidArgumentException('Expected a jQuery object with just 1 element, got more or none.');
			
            var type = element.attr(this.DataPanelType); // Check for tag
			if(type === undefined)
				throw new InvalidArgumentException('Expected an element with a DataGroupType tag, but the given element did not have any.');
			
			var panelElement = element.detach();
			var contentElement = this.ExtractContentElement(panelElement);
			var conf = this.ExtractPanelConfig(panelElement);
			
			var panelName = panelElement.attr('id');
			if(panelName === null || panelName == '')
				panelName = undefined;
			
			return {
				Panel: this.LiftedPanelConstructor(panelElement, contentElement, panelName, type, conf.Value1),
				GroupConfig: conf.Value2
			};
        }
        
        /**
         * Lifts a group from an element or a sub element. Only works on JQuery collections of length=1.
         */
        public static LiftPanelGroupFromElement(element: JQuery): ILiftedPanelData {
			if(!element.length || element.length > 1)
				throw new InvalidArgumentException('Expected a jQuery object with just 1 element, got more or none.');
			
            var type = element.attr(this.DataGroupType); // Check for tag
			if(type === undefined)
				throw new InvalidArgumentException('Expected an element with a DataGroupType tag, but the given element did not have any.');
			
			var panelElement = element.detach();
			var contentElement = this.ExtractContentElement(panelElement);
			var conf = this.ExtractPanelConfig(panelElement);
			
			var panelName = panelElement.attr('id');
			if(panelName === null || panelName == '')
				panelName = undefined;
			
			var panels: ILiftedPanelData[];
			if(contentElement != undefined)
				panels = this.LiftAllWithPanelDataFromElement(contentElement);
			else panels = this.LiftAllWithPanelDataFromElement(panelElement);
			
			return {
				Panel: this.LiftedGroupConstructor(panelElement, contentElement, panelName, type, conf.Value1, panels),
				GroupConfig: conf.Value2
			};
        }
        
        /**
         * Lifts all panels from the given element. Also considers the element(s) themselves.
         * @returns A panel, panelgroup or a collection of either or both.
         */
        public static LiftAllFromElement(elements: JQuery): IPanel[] {
            var panels: IPanel[] = [];
            elements.each((index, par) => {
				jQuery(par).children().each((index, elem) => {
					var $elm = jQuery(elem);
					var tp = this.IsLiftableElement($elm);
					switch(tp){
						case LiftableElementState.Panel:
							panels.push(this.LiftPanelFromElement($elm).Panel);
							break;
						case LiftableElementState.Group:
							panels.push(this.LiftPanelGroupFromElement($elm).Panel);
							break;
						case LiftableElementState.NotLiftable:
							panels.concat(this.LiftAllFromElement($elm));
							break;
					}
				});
            });
            return panels;
        }
        
        private static LiftAllWithPanelDataFromElement(element: JQuery): ILiftedPanelData[] {
            var panels: ILiftedPanelData[] = [];
            element.each((index, par) => {
				jQuery(par).children().each((index, elem) => {
					var $elm = jQuery(elem);
					var tp = this.IsLiftableElement($elm);
					switch(tp){
						case LiftableElementState.Panel:
							panels.push(this.LiftPanelFromElement($elm));
							break;
						case LiftableElementState.Group:
							panels.push(this.LiftPanelGroupFromElement($elm));
							break;
						case LiftableElementState.NotLiftable:
							panels.concat(this.LiftAllWithPanelDataFromElement($elm));
							break;
					}
				});
            });
            return panels;
        }
        
        /**
         * Check on a SINGLE element if it is liftable.
         */
        public static IsLiftableElement(element: JQuery): LiftableElementState {
            if(element.attr(this.DataPanelType) != undefined) return LiftableElementState.Panel;
            if(element.attr(this.DataGroupType) != undefined) return LiftableElementState.Group;
            return LiftableElementState.NotLiftable;
        }
        
        private static ExtractPanelConfig(panelElement: JQuery): Collections.Pair<any[], any[]> {
            var pconf = panelElement.attr(this.DataPanelConfig);
            var panelConfig: any[];
            if(pconf != undefined && pconf.length > 0){
                panelConfig = JSON.parse(pconf);
            }else panelConfig = [];
            
            var gconf = panelElement.attr(this.DataGroupConfig);
            var groupConfig: any[];
            if(gconf != undefined && gconf.length > 0){
                groupConfig = JSON.parse(gconf);
            }else groupConfig = [];
            
            return new Collections.Pair<any[], any[]>(panelConfig, groupConfig);
        }
        
        private static ExtractContentElement(panelElement: JQuery): JQuery {
            var contentElement = panelElement.find('['+this.DataElementRole+'=content]');
            if(contentElement.length == 0)
                return undefined;
            else return contentElement.first();
        }
        
        /**
         * Lifts a panel from the element and returns it as the given type.
         */
        public static LiftTypedPanelFromElement<TPanel extends IPanel>(element: JQuery): TPanel {
            return <any> this.LiftPanelFromElement(element);
        }
        
        private static LiftedPanelConstructor(panelElement: JQuery, contentElement: JQuery, panelName?: string, panelType?: string, panelConfig?: any): IPanel {
            if(panelType != undefined && panelType.length > 0){
                // Defined type
                var constr = this.GetPanelObjectByString(panelType);
                if(constr == null){
                    console.error('Undefined panel type set in element attribute. Given type "'+panelType+'" was not found and could not be instantiated.');
                    // try to fix it with the Default type
					return this._setPanelName<IPanel>(this.DefaultPanelConstructor(panelElement, contentElement, panelConfig), panelName);
                }else{
                    return this._setPanelName<IPanel>(
						new (
							constr.bind.apply(
								constr,
								[constr].concat(panelConfig)
							)
						)(),
						panelName
					);
                }
            }else{
                // Default type
                return this._setPanelName<IPanel>(this.DefaultPanelConstructor(panelElement, contentElement, panelConfig), panelName);
            }
        }
        
        private static LiftedGroupConstructor(panelElement: JQuery, contentElement: JQuery, panelName?: string, groupType?: string, panelConfig?: any, panels: ILiftedPanelData[] = []): IPanelGroup {
            if(groupType != undefined && groupType.length > 0){
                // Defined type
                var constr = this.GetGroupObjectByString(groupType);
                if(constr == null){
                    console.error('Undefined panel type set in element attribute. Given type "'+groupType+'" was not found and could not be instantiated.');
                    // try to fix it with the Default type
                    return this._setPanelName<IPanelGroup>(this.DefaultPanelGroupConstructor(panelElement, contentElement, panelConfig, panels), panelName);
                }else{
                    var pn = this._setPanelName<ILiftablePanelGroup>(
						new (
							constr.bind.apply(
								constr,
								[constr].concat(panelConfig)
							)
						)(),
						panelName
					);
                    pn.FillFromElement(panelElement, panels);
                    return pn;
                }
            }else{
                return this._setPanelName<IPanelGroup>(this.DefaultPanelGroupConstructor(panelElement, contentElement, panelConfig, panels), panelName);
            }
        }
		
		private static _setPanelName<T extends IPanel>(obj: T, panelName: string): T{
			if(panelName != undefined)
				obj.PanelName = panelName;
			return obj;
		}
        
        /**
         * This method does a basic copy that will be able to replace the panel elements for most panels.
         * WARNING: This method makes assumptions, it will for example not copy any attributes other thatn the id and class attributes.
         */
        public static ReplacePanelElements(panel: IPanel, panelElement?: JQuery, contentElement?: JQuery): void {
            var pn = <ProtectedPanel> <any> panel;
            
            // panel element
            if(panelElement != undefined){
                // copy panel name
                panelElement.attr('id', pn._panelElement.attr('id'));
                
                // copy any added classes
                var classes = pn._panelElement.attr('class').split(" ");
                for(var i=0; i<classes.length; i++){
                    panelElement.addClass(classes[i]);
                }
                
                pn._panelElement = panelElement;
            }
            
            // content element
            if(contentElement != undefined && panelElement != contentElement){
                if(pn._panelElement == pn._contentElement){
                    pn._contentElement = contentElement;
                }else{
                    // copy any added classes
                    var classes = pn._contentElement.attr('class').split(" ");
                    for(var i=0; i<classes.length; i++){
                        contentElement.addClass(classes[i]);
                    }
                    
                    pn._contentElement = contentElement;
                }
            }
        }
        
		/**
		 * Determines whether the object given can be used as a liftable panel .
		 */
        public static IsLiftablePanel(obj: Object): boolean {
			if(obj == undefined) return false;
			return true;
			// @todo Re-enable the code below and test it thoroughly.
			/*if(typeof obj == 'function'){
				return (typeof (<Function> obj).prototype['FillFromElement'] == 'function');
			}else{
				return (typeof obj['FillFromElement'] == 'function');
			}*/
        }
        
		public static FindElementWithRole(root: JQuery, role: string): JQuery {
			return root.find('['+this.DataElementRole+'='+role+']');
		}
		
        private static GetPanelObjectByString(objectPath: string): Function {
            var obj: Object;
            if(objectPath.indexOf('.') > -1)
                obj = this.ResolveObjectForPath(objectPath);
            else
                obj = Panels[objectPath];
            if(this.IsLiftablePanel(obj))
                return <any> obj;
            else return null;
        }
        
        private static GetGroupObjectByString(objectPath: string): Function {
            var obj: Object;
            if(objectPath.indexOf('.') > -1)
                obj = this.ResolveObjectForPath(objectPath);
            else
                obj = Panels.Groups[objectPath];
            if(this.IsLiftablePanel(obj))
                return <any> obj;
            else return null;
        }
        
        private static ResolveObjectForPath(objectPath: string): Function {
            try {
                var spl = objectPath.split('.');
                var obj = window;
                for(var i=0; i<spl.length; i++)
                    obj = obj[spl[i]];
                return <any> obj;
            }catch(e){
                return undefined;
            }
        }
    }
}