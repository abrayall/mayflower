<img src="https://maxcdn.icons8.com/iOS7/PNG/100/Transport/sailing_ship_large_filled-100.png" title="Sailing Ship Large Filled" width="100">
# Mayflower.js

Mayflower.js is a simple JavaScript library that provides class (inheritence and mixin) support and a basic template based widget framework.

Mayflower.js is designed to be lightweight, small, and fast.  It is simple to setup, use, and learn.  It is intended to help aid JavaScript development, not get in the away.


## Dependencies
jQuery is the only Mayflower dependency.  jQuery was chosen as a foundation for Mayflower, because jQuery is lightweight, small, and fast as well.


## Install
Download mayflower.js and make it available in your html code.


## Examples
#### Loading Mayflower.js
```html
<html>
	<body>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
	</body>
</html>
```

#### Hello, World Class
```html
<html>
	<body>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.declare('my.HelloWorld', {
				run: function() {
					alert('hello, world')
				}
			})

			var hello = new my.HelloWorld()
			hello.run()
		</script>
	</body>
</html>
```

#### Hello, World Class with Inheritance
```html
<html>
	<body>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.declare('my.HelloWorld', {
				run: function() {
					alert('hello, world')
				}
			})

			$.declare('my.HelloWorld2', my.HelloWorld, {
				run: function(parameter1) {
					this.__super()
					alert(parameter1)
				}
			})

			var hello = new my.HelloWorld2()
			hello.run('Fred')
		</script>
	</body>
</html>
```

#### Hello, World Class with Constructor
```html
<html>
	<body>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.declare('my.HelloWorld', {
				__constructor: function(value) {
					this.value = value
				},

				run: function() {
					alert('hello, world ' + this.value)
				}
			})

			var hello = new my.HelloWorld('Fred')
			hello.run()
		</script>
	</body>
</html>
```

#### Hello, World Class in Separate File
##### js/hello.js
```javascript
$.declare('my.HelloWorld', {
	__constructor: function(value) {
	  this.value = value
	},

	run: function() {
		alert('hello, world ' + this.value)
	}
})
```
##### index.html
```html
<html>
	<body>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.import('hello.js')
			var hello = new my.HelloWorld('Fred')
			hello.run()
		</script>
	</body>
</html>
```

#### Hello, World Widget
##### js/hello.js
```javascript
$.declare('my.HelloWorld', widget.Widget, {
	start: function() {
		this.$node.html('Hello, World')
	}
})
```

##### index.html
```html
<html>
	<body>
		<div id="widget"></div>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.import('hello.js')
			widget.create('my.HelloWorld', {}, $("#widget"))
		</script>
	</body>
</html>
```

#### Hello, World Template Widget
##### js/hello.js
```javascript
$.declare('my.HelloWorld', widget.TemplateWidget, {
	template: '<div>Hello, World</div>'
})
```

##### index.html
```html
<html>
	<body>
		<div id="widget"></div>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.import('hello.js')
			widget.create('my.HelloWorld', {}, $("#widget"))
		</script>
	</body>
</html>
```

#### Hello, World Template Widget in Markup
##### js/hello.js
```javascript
$.declare('my.HelloWorld', widget.TemplateWidget, {
	template: '<div>Hello, World</div>'
})
```

##### index.html
```html
<html>
	<body>
		<div data-widget-type="my.HelloWorld"></div>
		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower.js"></script>
		<script>
			$.import('hello.js')
			$(document).ready(function() {
				$(document).widgets()
			})
		</script>
	</body>
</html>
```
