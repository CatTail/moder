var path = require('path'),
    assert = require('assert'),
    indexjs = require('../');

describe('index.js', function() {
    var case1 = indexjs(__dirname + '/modules/case1');
    var case2 = indexjs(__dirname + '/modules/case2', {lazy: false});
    var case3 = indexjs(__dirname + '/modules/case3');

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
        assert.equal(!!require.cache[__dirname + '/modules/case2/user.js'], true);
        assert.equal(!!require.cache[__dirname + '/modules/case2/blog.js'], true);
    });

    it('should support directory module load', function() {
        assert.equal(case3.app1, 'app1');
        assert.equal(case3.app2, 'app2');
    })
});
