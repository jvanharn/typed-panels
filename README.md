# Typed Panels

Typed Panels is a Javascript framework written entirely in [TypeScript](http://www.typescriptlang.org/) which tries to make you look at an web application in an entirely different way. It focusses on atomic functionality in your interface and let's you group, reuse and shuffle it all over the UI without you as a developer only ever having to worry about where to put it, and not how to put it somewhere.
*[Check out the Wiki](https://github.com/jvanharn/typed-panels/wiki)*

## Download
Download the latest versions from the [dist/](https://github.com/jvanharn/typed-panels/tree/master/dist) directory or download the point releases here:
 * **Latest Stable**: N/A
 * **Latest Testing**: [v0.0.1-alpha.zip](https://github.com/jvanharn/typed-panels/releases/tag/v0.0.1-alpha)
 * **Master Branch**: [master.zip](https://github.com/jvanharn/typed-panels/archive/master.zip)


## Should I use it?
You should consider this framework when you're:
 * Creating a (Rich) Web Application
 * Considering or beginning to use [TypeScript](http://www.typescriptlang.org/)
 * Require a consistent UI
 * Want to worry less about maintainability of your UI and want to build it in as little time as possible
 * Miss the LINQ (or other DSL for objects) and Generics you had in your Server side language and want to reuse that knowledge
 * Using or want to use Underscore templates or other client side templating languages

[More on when to use Typed Panels](https://github.com/jvanharn/typed-panels/wiki/Considering-Typed-Panels)

## Layout and Functionality First
This framework may require a different way of thinking about your User Interface. The purpose of this framework is to help you build your frontend as in reusable components and with as little coupling between those panels as possible. With relations only going from top to bottom. This way you can basically throw any component anywhere in the interface, as long as you provide it with the data it needs to render that UI.
It takes the idea behind Backbone.js (Which it is inspired by from a code perspective) and leverages the power of TypeScript to stick with those ideas and not end up with the same giant mess of code that you had before you ported everything to Backbone. (I have seen it happen multiple times.

This is also the idea behind this framework;
**_Do more, in less time, and only do it once._**

[Learn More](https://github.com/jvanharn/typed-panels/wiki/Layout-First-Approach)

## Examples
Here are the four absolute basic components neede to build an Web Application with Typed Panels. Check out our [other samples](https://github.com/jvanharn/typed-panels/tree/master/samples) to get a better understanding of the power of the LINQ bindings, more advanced models, automatically compositing UI Grids, Animations with Viewport Managers, etc.
### Super simple (view)models
Using the strength of TypeScript models are super easy to setup and above all use. A model can be as simple as the example below;
```javascript
class BookModel extends Model.ViewModel<BookModel> {
    public id: number = null;
    public Title: string = null;
    public Author: string = 'John Doe'; // Set an default value
    public ISBN: string = null;

    constructor(options?: Model.ViewModelOptions){
        // Make it load from this Rest URL (Web API, WCF, Ruby, PHP.Rest backend, ...)
        super('/api/books', options);
        // Makes all the properties above getters and setters making them act like properties as in C#
        this.RefreshModelProperties();
    }
}
```
After a model is created you can subscribe to events on that model to react on change in the model or other UI elements that update the model.

### Panels
Panels are atomic pieces of functionality or pieces in the UI that display some form of data, or just some generic markup. They contain as little HTML markup and DOM manipulation operations as possible themselves, and try to offload that type of tasks to the templates wherever possible.
```javascript
class BookPanel extends Panels.ModelPanel<BookModel> {
    public Render(): void {
        // This renders the model (this is called a Panel State in TypedPanels) with the Underscore template 'bookview.html'
        return this.RenderModel('bookview');
    }
}
```

### Familiar views
Using any client side Templating language/library you can display the data in your model. In this example the book get's displayed in a [jumbotron from Bootstrap](http://getbootstrap.com/components/#jumbotron) using the (default) [Underscore/Lodash templates](http://underscorejs.org/#template).
```html
<div class="container-fluid">
	<div class="jumbotron">
	  <h1><%- Title %></h1>
	  <h2><%- Author %></h2>
	  <p><%- ISBN %></p>
	  <p><a class="btn btn-primary btn-lg" role="button">Buy *all* the books</a></p>
	</div>
</div>
```

### Panel Groups
These panels are managed in Panel groups. These groups are what position the panels, and thus functionality in the interface. They manage Animations, make it super easy to create Tabs and other grouping operations in your UI. They make up the Layout of your application. The concept of Panels and Panel Groups ar the core of an application built with the Typed Panels framework.
The example below creates one of the simplest panels in the framework and adds an instance of our book Panel inside of it, then renders all of it. Normally you would place this kind of code in an Single Entry point like an Application class.
```javascript
// Initialize the model for our panel
var book = new BookModel();
// Either: Just like in Backbone.js
book.fetch();
// OR: manually fill it
book.Title = 'Macbeth';
book.Author = 'William Shakespeare';
book.ISBN = '978-0-000-00000-1';

// Create the panel
var panel = new BookPanel(book);

// Initialize the panel group
var group = new Panels.Groups.TabbedPanelGroup();
group.AddPanel(panel);

// Render the UI
group.Render();
panel.Render();

// Add it to the DOM
$(body).append($('<div class="panel-wrapper">').append(group.PanelElement));
```
