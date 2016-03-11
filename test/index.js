var path = require('path'),
    assert = require('assert'),
    moder = require('../');
require("babel-register");

describe('moder', function() {
    this.timeout(5000) // babel compile time
    var case1 = moder(__dirname + '/modules/case1');

    it('should access all modules in directory', function () {
        assert.equal(case1.user, 'user');
    });

    it('should lazy load modules', function() {
        assert.equal(!!require.cache[__dirname + '/modules/case1/user.js'], true);
        assert.equal(!!require.cache[__dirname + '/modules/case1/blog.js'], false);
    });

    it('should filter certain files', function() {
        assert.equal(case1.index, undefined);
    });

    it('should support non lazy module load', function() {
        var case2 = moder(__dirname + '/modules/case2', {lazy: false});
        assert.equal(!!require.cache[__dirname + '/modules/case2/user.js'], true);
        assert.equal(!!require.cache[__dirname + '/modules/case2/blog.js'], true);
    });

    it('should support directory module load', function() {
        var case3 = moder(__dirname + '/modules/case3');
        assert.equal(case3.app1, 'app1');
        assert.equal(case3.app2, 'app2');
    });

    it('should support initialization', function() {
        var case4 = moder(__dirname + '/modules/case4', function(mod) {
            return 'anothername';
        });
        assert.equal(case4.mod, 'anothername');
    });

    it('should support ES6 module', function() {
        var case5 = moder(__dirname + '/modules/case5');
        assert.deepEqual(case5.hello, { default: 'world' });
    });
});
