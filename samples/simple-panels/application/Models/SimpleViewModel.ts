// Simple viewmodel
class SimpleViewModel extends Model.ViewModel<SimpleViewModel> {
    public id: number = null;
    public Greeting: string = null;

    constructor(options: Model.ViewModelOptions = {}){
        super(null, options);
		this.RefreshModelProperties();
    }
}