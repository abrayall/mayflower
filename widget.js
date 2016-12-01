$.fn.widgets = function() { widget.factory.parse() }

lang.declare('widget._Factory', {

	registry: {},

	parse: function(node) {
		node = (node == undefined ? $(":root") : $(node))
		$.each(node.find("[data-widget-type]").not("[data-widget-type] [data-widget-type]"), $.proxy(function(index, child) {
			if ($(child).parents().last()[0] != node[0])
				return

			if (child.getAttribute('widgetId') == undefined)
				this.create($(child).attr('data-widget-type'), this.attributes(child), child)
		}, this))
		return this.registry
	},

	create: function(clazz, options, node) {
		var widget = this.register(this.instantiate(clazz, options, node == undefined || node.jquery == undefined ? node : node.get(0)))
		widget.start()
		return widget
	},

	instantiate: function(clazz, options, node) {
		return new (window[clazz] || lang.get(window, clazz))(options, node)
	},

	register: function(widget) {
		widget.id = widget.id || lang.size(this.registry)
		widget.node.setAttribute("widgetId", widget.id)
		this.registry[widget.id] = widget

		if (widget.options.id == undefined)
			widget.options.id = widget.id

		if (widget.options.name)
			window[widget.options.name] = widget

		return widget
	},

	attributes: function(node) {
		var attributes = {}
		$.each(node.attributes, $.proxy(function(index, attribute) {
			attributes[attribute.name.replace("data-", "")] = this.value(attribute.value)
		}, this))

		return attributes;
	},

	value: function(text) {
	 	if (text.toLowerCase() == "false")
	 		return false;
	 	else if (text.toLowerCase() == "true")
	 		return true;
		else if ($.isNumeric(text))
			return parseInt(text)
		else
			return text;
	}
});

lang.declare('widget.Widget', {

	defaults: {},

	__constructor: function(options, node) {
		this.setNode(node || $.parseHTML("<div></div>")[0])
		this.options = $.extend({}, this.defaults, options)
	},

	getNode: function() {
		return this.node
	},

	setNode: function(node) {
		this.node = node
		this.node.setAttribute("widgetId", this.id)
		this.$node = $(this.node)
	},

	start: function() {},
	destroy: function() {
		this.$node.remove()
	},

	show: function() { this.$node.show() },
	hide: function() { this.$node.hide() },
	toggle: function(value) { this.$node.toggle(value) },

	on: function(node, action, callback) {
		$(node).on(action, $.proxy(callback, this))
	},

	watch: function(method, callback) {
		lang.watch(this, method, callback, this)
	},

	connect: function(object, method, callback) {
		lang.watch(object, method, callback, this)
	}
})

lang.declare('widget.TemplateWidget', widget.Widget, {

	template: '<div></div>',

	start: function() {
		this.setNode(this._replace(this.node, this._process(this.template, $.extend($.extend({}, this.options), this), this.$node.contents())))
	},

	destroy: function() {
		if (this.$node)
			this.$node.remove()
	},

	_process: function(template, variables, content) {
		return this._parse(this._evaluate(template, variables), content)
	},

	_parse: function(text, content) {
		var dom = $(text)
		$.each(this._children(dom, "[data-attach-point='content']"), $.proxy(function(index, node) {
			content.detach().prependTo($(node))
		}, this))

		widget.factory.parse(dom)
		$.each(this._children(dom, "[data-attach-point]"), $.proxy(function(index, node) {
			if (widget.get(node))
				this._set(this._lookup($(node)), $(node).attr("data-attach-point"), widget.get(node))
			else
				this._set(this, $(node).attr("data-attach-point"), node, true)
		}, this))

		$.each(this._children(dom, "script").add((content || $()).filter('script')), $.proxy(function(index, node) {
			var fn = new Function((node.getAttribute('args') || '').split(/\s*,\s*/), $(node).html())
			if (node.getAttribute('type') == 'on')
				this.on($(node).parent(), node.getAttribute('event'), fn)
			else if (node.getAttribute('type') == 'watch')
				this.watch(node.getAttribute('method'), fn)
			else if (node.getAttribute('type') == 'method')
				lang.extend(node.getAttribute('context') == 'node' ? this[$(node).parent().attr('data-attach-point')] || $(node).parent().get(0) : widget.get(this.$node) || widget.get($(node).parent()), node.getAttribute('method'), fn)
		}, this))

		dom.addClass(this.options['class'] || '')
		return dom
	},

	_evaluate: function(template, object) {
		for (item in object)
			template = template.replace(new RegExp("{" + item + "}", 'g'), object[item])

		return $(template)
	},

	_replace: function(target, content) {
		$(target).replaceWith(this._copy(target, content))
		return content[0]
	},

	_children: function(root, match) {
		return root == undefined ? $() : root.find(match).not("[data-widget-type] " + match)
	},

	_lookup: function(node) {
		return widget.get(node.attr("data-attach-context") || "", this)
	},

	_copy: function(source, target) {
		target = $(target)
		for (var i = 0; i < source.attributes.length; i++)
			if (target.attr(source.attributes[i].name) == undefined)
				target.attr(source.attributes[i].name, source.attributes[i].value)

		return target
	},

	_set(object, attribute, value, wrap) {
		lang.set(object, attribute, value)
		if (wrap == true)
			lang.set(object, '$' + attribute.replace(/\./g, '.$'), $(value))
	}
})

lang.declare('Widget', widget.Widget, {
	__constructor: function(options, node) {
		console.log("Deprecated class Widget, please use widget.Widget")
		this.__base(options, node)
	}
})

lang.declare('TemplateWidget', widget.TemplateWidget, {
	__constructor: function(options, node) {
		console.log("Deprecated class TemplateWidget, please use widget.TemplateWidget")
		this.__base(options, node)
	}
})

lang.module('widget', {
	factory: new widget._Factory(),

	get: function(id, defaultValue) {
		return widget.factory.registry[id['getAttribute'] ? id.getAttribute('widgetId') : id['attr'] ? id.attr('widgetId') : id] || defaultValue
	},

	create: function(clazz, options, node) {
		return widget.factory.create(clazz, options, node)
	},

	destroy: function(node) {
		widget.get(node).destroy()
	}
})
