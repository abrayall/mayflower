(function() {

	function size(object) {
		var size = 0, key
		for (key in object)
			if (object.hasOwnProperty(key)) size++

		return size
	}

	function get(object, path, defaultValue) {
		var parts = path.split('.')
		for (var i = 0; i < parts.length - 1; i++)
			object = object[parts[i]] || {}

		return object[parts[parts.length - 1]] || defaultValue
	}

	function set(object, path, value) {
		var parts = path.split('.')
		for (var i = 0; i < parts.length - 1; i++) {
			if (object[parts[i]] == undefined)
				object[parts[i]] = {}

			object = object[parts[i]]
		}

		object[parts[parts.length - 1]] = value
		return value
	}

	function extend(object, method, fn) {
		object[method] = $.proxy(fn, object)
		return object
	}

	function watch(object, method, fn, context) {
		var base = $.proxy(object[method], object)
		object[method] = $.proxy(function() {
			if (base) base.apply(this, arguments)
			fn.apply(context, arguments)
		}, context || window || global)
		return object
	}

	var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1

	$.instantiate = instantiate = Object.create || function(clazz) {
		var inheritance = function() {};
		inheritance.prototype = clazz;
		return new inheritance();
	}

	function override(base, result, add) {
		$.each(add, function(name, value) {
			result[name] = value
			if ($.isFunction(value) && (!hasIntrospection || value.toString().indexOf('.__super') > -1)) {
				var method = base[name] || function() {}
				result[name] = function() {
					var saved = this.__super
					this.__super = method
					var result = value.apply(this, arguments)
					this.__super = saved
					return result
				};
			}
		})

		return result
	}

	$.fn.declare = $.declare = declare = function(name, bases, properties) {
		if ($.isPlainObject(bases)) {
			properties = bases
			bases = [function() {}]
		}

		if ($.isFunction(bases))
			bases = [bases]

		var result = override({}, function() {
			if (this.__constructor) return this.__constructor.apply(this, arguments)
		}, bases[0])

		result.prototype = instantiate(bases[0].prototype)
		result.prototype.__self = result.prototype.constructor = result

		$.each(bases.slice(1).concat([properties]), function(index, mixin) {
			$.extend(result.prototype, instantiate(bases[index].prototype))
			override($.extend({}, result.prototype), result.prototype, mixin)
		})

		return name ? set(window || global, name, result) : result
	}

	function module(name, exports) {
		return set(window || global, name, $.extend(get(window || global, name, {}), exports))
	}

	$.fn.exists = function() {
		return this.length > 0
	}

	return module('lang', {
		'get': get,
		'set': set,
		'size': size,
		'module': module,
		'declare': declare,
		'extend': extend,
		'watch': watch,
		'instantiate': instantiate
	})
}).call(jQuery);
