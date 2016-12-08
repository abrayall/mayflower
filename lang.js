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
		}, context || window)
		return object
	}

	var hasIntrospection = (function(){'_';}).toString().indexOf('_') > -1,
		emptyBase = function() {},
		objCreate = Object.create || function(ptp) {
			var inheritance = function() {};
			inheritance.prototype = ptp;
			return new inheritance();
		},
		needCheckProps = true,
		testPropObj = { toString : '' };

	for(var i in testPropObj) {
		testPropObj.hasOwnProperty(i) && (needCheckProps = false);
	}

	var specProps = needCheckProps? ['toString', 'valueOf'] : null;

	function override(base, result, add) {
		var hasSpecProps = false;
		if(needCheckProps) {
			var addList = [];
			$.each(specProps, function() {
				add.hasOwnProperty(this) && (hasSpecProps = true) && addList.push({
					name : this,
					val  : add[this]
				});
			});
			if(hasSpecProps) {
				$.each(add, function(name) {
					addList.push({
						name : name,
						val  : this
					});
				});
				add = addList;
			}
		}

		$.each(add, function(name, prop) {
			if(hasSpecProps) {
				name = prop.name;
				prop = prop.val;
			}
			if($.isFunction(prop) &&
			   (!hasIntrospection || prop.toString().indexOf('.__base') > -1)) {

				var baseMethod = base[name] || function() {};
				result[name] = function() {
					var baseSaved = this.__base;
					this.__base = baseMethod;
					var result = prop.apply(this, arguments);
					this.__base = baseSaved;
					return result;
				};

			}
			else {
				result[name] = prop;
			}

		});

	}

	$.fn.declare = $.declare = declare = function() {
		var args = arguments,
			name = args[0]
			hasBase = $.isFunction(args[1]),
			base = hasBase ? args[1] : emptyBase,
			props = args[hasBase ? 2 : 1] || {},
			staticProps = args[hasBase ? 3 : 2],
			result = props.__constructor || (hasBase && base.prototype.__constructor)?
				function() {
					return this.__constructor.apply(this, arguments);
				} : function() {};

		if (!hasBase) {
			result.prototype = props;
			result.prototype.__self = result.prototype.constructor = result;
			return set(window, name, $.extend(result, staticProps));
		}

		$.extend(result, base);

		var basePtp = base.prototype,
			resultPtp = result.prototype = objCreate(basePtp);

		resultPtp.__self = resultPtp.constructor = result;

		override(basePtp, resultPtp, props);
		staticProps && override(base, result, staticProps);

		return set(window, name, result)
	}

	function module(name, exports) {
		return set(window, name, $.extend(get(window, name, {}), exports))
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
		'watch': watch
	})
}).call(jQuery);
