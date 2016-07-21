var path = require('path'),
    assert = require('assert'),
    moder = require('../')
require("babel-register")

describe('moder', function() {
    this.timeout(10000) // babel compile time
    var case1 = moder(__dirname + '/modules/case1')

    it('should access all modules in directory', function () {
        assert.equal(case1.user, 'user')
    })

    it('should lazy load modules', function() {
        assert.equal(!!require.cache[__dirname + '/modules/case1/user.js'], true)
        assert.equal(!!require.cache[__dirname + '/modules/case1/blog.js'], false)
    })

    it('should filter certain files', function() {
        assert.equal(case1.index, undefined)
    })

    it('should support non lazy module load', function() {
        var case2 = moder(__dirname + '/modules/case2', {lazy: false})
        assert.equal(!!require.cache[__dirname + '/modules/case2/user.js'], true)
        assert.equal(!!require.cache[__dirname + '/modules/case2/blog.js'], true)
    })

    it('should support directory module load', function() {
        var case3 = moder(__dirname + '/modules/case3')
        assert.equal(case3.app1, 'app1')
        assert.equal(case3.app2, 'app2')
    })

    it('should support initialization', function() {
        var case4 = moder(__dirname + '/modules/case4', function(mod) {
            return 'anothername'
        })
        assert.equal(case4.mod, 'anothername')
    })

    it('should support ES6 module', function() {
        var case5 = moder(__dirname + '/modules/case5')
        assert.deepEqual(case5.hello, { default: 'world' })
    })

    it('should convert module name to camel case', function() {
        var case6 = moder(__dirname + '/modules/case6', {naming: 'camel'})
        assert.deepEqual(case6.fooBar, 'hello world')
    })

    it('should convert module name to camel case without lazy evaluation', function() {
        var case7 = moder(__dirname + '/modules/case7', {lazy: false, naming: 'camel'})
        assert.deepEqual(case7.fooBar, 'hello world')
    })

    it('should convert module name to pascal case', function() {
        var case8 = moder(__dirname + '/modules/case8', {naming: 'pascal'})
        assert.deepEqual(case8.FooBar, 'hello world')
    })

    it('should only require .js files', function() {
        var case9 = moder(__dirname + '/modules/case9')
        assert.deepEqual(case9.foo, 'hello world')
        assert.deepEqual(case9.bar, undefined)
    })

    it('should allow custom filter', function() {
        var case10 = moder(__dirname + '/modules/case10', {
            lazy: false,
            filter: function(moduleName) {
                return moduleName.indexOf('-test') !== -1
            },
        })
        assert.deepEqual(case10.foo, 'hello world')
        assert.deepEqual(case10['foo-test'], undefined)
    })
})
