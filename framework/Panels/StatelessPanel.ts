module Panels {
    /**
     * Panel that get's rendered only once, and only when needed based on a unfetched model. (That only get's fetched when the actal render method is called or the content element is retrieved or the model is fetched.)
     * @abstract
     */
    export class StatelessPanel<TState extends Model.ViewModel<any>> extends Panel {
        private _rendered: boolean = false;
        private _state: TState;
        
        /**
         * Get the current state of the object.
         */
        get State(): TState {
            return this._state;
        }
        
        /**
         * @access private
         */
        set State(value: TState) {
            throw new MethodNotAccessibleException();
        }
        
        /**
         * Check whether this class has already been rendered.
         */
        get IsRendered(): boolean {
            return this._rendered;
        }
        
        /**
         * Get the innermost element of the panel.
         */
        get ContentElement(): JQuery {
            if(this._rendered === false)
                this.Render();
            return this.Cast<ProtectedPanel>()._contentElement;
        }
        
        constructor(model: TState) {
            super();
            this._state = model;
            this._state.On('change', this.Render.bind(this));
        }
        
        /**
         * Calls the deferred renderer only once.
         */
        public Render(): void {
            if(!this.IsRendered){
                this._rendered = true;
                this.StateRenderer();
            }else console.log('State change or render request on stateless panel "'+this.PanelName+'"['+this.PanelSeqId+'] has been ignored because the panel has already been rendered.');
        }
        
        /**
         * This is the deferred renderer function.
         * Implement it to use this abstract class.
         * @abstract
         */
        public StateRenderer(): void{
            throw new AbstractMethodException();
        }
    }
}