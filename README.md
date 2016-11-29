# Mayflower.js
==============
Mayflower.js is a super lightweight and simple javascript library that provides class (inheritence) support and a basic template based widget framework.

Mayflower.js was designed to be lightweight, small and fast.  It is simple to setup, use and learn.  It is intended to help aid javascript developement, not get in the away.


### Dependencies
----------------
jQuery is the only Mayflower dependency.  jQuery was choosen as a foundation for Mayflower, because jQuery is lightweight, small and fast as well.


### Install
-----------
Download lang.js and/or widgets.js and make them available in your html code.


### Examples
------------
#### Loading Mayflower.js
```html
<html>
    <body>
        <script src="js/jquery.min.js"></script>
        <script src="js/mayflower/lang.js"></script>
    </body>
</html>
```

#### Hello, World Class
```html
<html>
    <body>
  		<script src="js/jquery.min.js"></script>
	    <script src="js/mayflower/lang.js"></script>
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

### Hello, World Class with Inheritance
```html
<html>
    <body>
  		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower/lang.js"></script>
        <script>
            $.declare('my.HelloWorld', {
                run: function() {
                    alert('hello, world')
                }
            })
          
            $.declare('my.HelloWorld2', my.HelloWorld, {
                run: function(parameter1) {
                    this.__base()
                    alert(parameter1)
                }
            })
          
            var hello = new my.HelloWorld2()
            hello.run()
        </script>
	</body>
</html>
```

### Hello, World Class with Constructor
```html
<html>
    <body>
  		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower/lang.js"></script>
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

### Hello, World Class in Seperate File
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
		<script src="js/mayflower/lang.js"></script>
		<script src="js/hello.js"></script>
        <script>
            var hello = new my.HelloWorld('Fred')
            hello.run()
        </script>
	</body>
</html>
```

### Hello, World Widget
##### js/hello.js
```javascript
$.declare('my.HelloWorld', Widget, {
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
	    <script src="js/mayflower/lang.js"></script>
		<script src="js/mayflower/widget.js"></script>
        <script src="js/hello.js"></script>
        <script>
            widget.create('my.HelloWorld', {}, $("#widget"))
        </script>
	</body>
</html>
```

### Hello, World Template Widget
##### js/hello.js
```javascript
$.declare('my.HelloWorld', TemplateWidget, {
    template: '<div>Hello, World</div>'
})
```

##### index.html
```html
<html>
    <body>
        <div id="widget"></div>
  		<script src="js/jquery.min.js"></script>
		<script src="js/mayflower/lang.js"></script>
		<script src="js/mayflower/widget.js"></script>
        <script src="js/hello.js"></script>
        <script>
            widget.create('my.HelloWorld', {}, $("#widget"))
        </script>
	</body>
</html>
```

### Hello, World Template Widget in Markup
##### js/hello.js
```javascript
$.declare('my.HelloWorld', TemplateWidget, {
    template: '<div>Hello, World</div>'
})
```

##### index.html
```html
<html>
    <body>
        <div data-widget-type="my.HelloWorld"></div>
  	    <script src="js/jquery.min.js"></script>
		<script src="js/mayflower/lang.js"></script>
		<script src="js/mayflower/widget.js"></script>
        <script src="js/hello.js"></script>
		<script>
		   $(document).ready(function() {
		       $(document).widgets()
		   })
        </script>
	</body>
</html>
```
