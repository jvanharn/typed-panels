/// <reference path="ConsumablePanel.ts" />

module Panels {
    export interface IStatefullPanel<TState> {
        State: TState;
    }
    
	/**
	 * Panel that requires a "state" to be able to be rendered. WHen the state changes, it is automatically rerendered.
	 * An example would be a model.
	 */
	export class StatefullPanel<TState> extends ConsumablePanel implements IStatefullPanel<TState> {
		private _state: TState;
		
		get State(): TState {
			return this._state;
		}
		
		set State(value: TState){
			this._state = value;
			if(this._renderOnStateChange)
				this.Render();
		}
		
		constructor(private _renderOnStateChange: boolean) {
			super();
		}
	}
	
	/**
	 * Statefull panel that can have a ViewModel as state object.
	 */
	export class ModelPanel<TModel extends Model.ViewModel<any>> extends ConsumablePanel implements IStatefullPanel<TModel> {
		private _state: TModel;
		
		get State(): TModel {
			return this._state;
		}
		
		set State(value: TModel){
			this._state = value;
			if(this._renderOnStateChange) {
				this.Render();
                this._state.On('change', () => this.Render());
			}
		}
		
		constructor(private _renderOnStateChange: boolean, viewModel: TModel) {
			super();
			this._state = viewModel;
			this._state.On('change', () => this.Render());
		}
		
		/**
		 * Render the current state object using the given template.
		 */
		public RenderModel(templateName: string, async: boolean=true): void {
			if(async)
				this.withTemplate(templateName, tpl => {
					this.ContentElement.html(tpl(this.State.ToObject()));
				});
			else this.GetTemplate(templateName)(this.State.ToObject);
		}
	}
}