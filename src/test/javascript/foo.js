$.provide("foo.Foo")

$.import('bar')
$.import('foobar')
$.import('foobar', function() {
	(window || global)['imported'] = true
})

$.declare('foo.Foo', [bar.Bar, foobar.Foobar], {
	foo: 'foo'
})
