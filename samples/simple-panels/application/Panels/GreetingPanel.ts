class GreetingPanel extends Panels.ModelPanel<SimpleViewModel> {
    public Render(): void {
        return this.RenderModel('greetingview');
    }
}