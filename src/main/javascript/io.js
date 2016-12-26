lang.declare("io.Rest", {

	base: "",
	error: null,

	__constructor: function(error) {
		this.error = error
		$.each(this, $.proxy(function(name, value) {
			if ($.isPlainObject(value))
				this.__proxy(value)
		}, this))
	},

	get: function(url, parameters, complete, error) {
		return this.ajax('GET', url, {}, parameters, complete, error)
	},

	post: function(url, parameters, complete, error) {
		return this.ajax('POST', url, {}, parameters, complete, error)
	},

	put: function(url, parameters, complete, error) {
		return this.ajax('PUT', url, {}, parameters, complete, error)
	},

	delete: function(url, parameters, complete, error) {
		return this.ajax('DELETE', url, {}, parameters, complete, error)
	},

	patch: function(url, parameters, complete, error) {
		return this.ajax('PATCH', url, {}, parameters, complete, error)
	},

	ajax: function(method, url, headers, parameters, complete, error) {
		return $.ajax({
			method: method,
			type: method,
			url: this.base + url,
			data: parameters || {},
			headers: this._headers(headers),
			withCredentials: true
		}).done(complete).fail(error || this.error)
	},

	_headers: function(headers) {
		return headers
	},

	__proxy: function(object) {
		$.each(object, $.proxy(function(name, item) {
			if ($.isFunction(item))
				object[name] = $.proxy(item, this)
			else if ($.isPlainObject(item))
				this.__proxy(item)
		}, this))
	}
})

lang.declare("io.Socket", {

	__constructor: function(url, handlers) {
		this.url = url;
		this.handlers = handlers || {}
	},

	connect: function() {
		this.socket = new WebSocket(this.url)
		this.socket.onopen = this.__handler('onOpen')
		this.socket.onclose = this.__handler('onClose')
		this.socket.onerror = this.__handler('onError')
		this.socket.onmessage = this.__handler('onMessage')
		this.timer = this.__timer();
		return this
	},

	close: function() {
		this.socket.close()
		clearInterval(this.__timer)
	},

	closed: function() {
		return this.socket == undefined || this.socket.readyState > 1
	},

	send: function(message) {
		this.socket.send(message)
	},

	__timer: function() {
		clearInterval(this.timer)
		return setInterval($.proxy(function() {
			if (this.closed())
				this.connect()
		}, this), 10000);
	},

	__handle(event, argument) {
		if (this.handlers[event])
			this.handlers[event].apply(this, [argument])
	},

	__handler(event) {
		return $.proxy(function(argument) {
			this.__handle(event, this["__" + event] ? this["__" + event].apply(this, [argument]) : argument)
		}, this)
	}
})

lang.declare('io.JsonSocket', Socket, {
	__onMessage: function(message) {
		return lang.parse(message.data)
	}
})

lang.module('io.socket', {
	url: function(path) {
		return "ws://" + window.location.hostname + (window.location.port != "" ? ":" + window.location.port : "") + path
	}
})
