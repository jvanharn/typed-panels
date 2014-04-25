/**
 * Generates templates and stores the compiled versions of them.
 * @static
 */
class TemplateFactory {
	public static ViewBasePath = 'views/';
	public static Templates: { [name: string]: _.TemplateExecutor } = {};
	
	public static WithTemplate(name: string, callback: (tpl: _.TemplateExecutor) => void): void {
		if(TemplateFactory.Templates[name] !== undefined)
			return callback(TemplateFactory.Templates[name]);
		jQuery.ajax(
			TemplateFactory.ViewBasePath + name + '.html',
			{
				async: true,
				dataType: 'text',
				success: (data) => {
					TemplateFactory.Templates[name] = _.template(data);
					callback(TemplateFactory.Templates[name]);
				},
				error: (xhr, statusCode, message) => 
					console.error('Unable to retrieve the template; ', statusCode, message)
			}
		);
	}
	
	public static GetTemplate(name: string): _.TemplateExecutor {
		if(TemplateFactory.Templates[name] !== undefined)
			return TemplateFactory.Templates[name];
		var tplData = '';
		jQuery.ajax(
			TemplateFactory.ViewBasePath + name + '.html',
			{
				async: false,
				dataType: 'text',
				success: function(data) { tplData = data; }
			}
		);
		return _.template(tplData);
	}
}